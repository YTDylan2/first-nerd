// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.

// REDIS ***NEEDS*** A CALLBACK FUNCTION
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Load up the discord.js library
const Discord = require("discord.js");
const Roblox = require("roblox-js");
const express = require("express");
const bodyParser = require('body-parser')
const validator = require('validator')
const http = require('http')
var app = express();
var key = process.env.key
// We also load the rest of the things we need in this file:
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const rethink = require("rethinkdb")
const EnmapRethink = require('enmap-rethink')
const redis = require('redis')
const cleverbot = require('cleverbot.io')
const recentMessages = new Set();


// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're refering to. Your client.
const client = new Discord.Client();


// Here we load the config file that contains our token and our prefix values.
client.config = require("./config.js");
client.config.prefix = process.env.prefix
// client.config.token contains the bot's token
// client.config.prefix contains the message prefix

// Require our logger
client.logger = require("./util/Logger");


// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./modules/functions.js")(client);

app.set('env', 'production')

Roblox.login({username: "GCRBOT", password: process.env.rbxpass})
    .then(function () {
        console.log("Logged in to ROBLOX")
       
    })
    .catch(function(err) {
        console.log("login error: " + err)
    });
client.caseLegendsPlayerData = []
client.savedPlayerData = new Enmap({ provider: new EnmapLevel({ name: 'playerData' }) });
client.lastCommand = "None"

client.cleverbot = new cleverbot(process.env.cbname, process.env.cbkey)
client.cleverbot.setNick("Main Session")

var groupBanned = {
    '294976424' : true,
    '620089904' : true,
}

function sendErr(res, json, status) {
    res.json(json);
}

function validatorType(type) {
    switch (type) {
        case 'int':
            return validator.isInt;
        case 'safe_string':
            return validator.isAlphanumeric;
        case 'boolean':
            return validator.isBoolean;
        case 'string':
            return function (value) {
                return typeof value === 'string';
            };
        default:
            return function () {
                return true;
            };
    }
}

function logDiscord(msg) {
     client.users.get(client.config.ownerID).send("```js" + msg + "```")
}
function processType(type, value) {
    switch (type) {
        case 'int':
            return parseInt(value, 10);
        case 'boolean':
            return (value === 'true');
        default:
            return value;
    }
}

function verifyParameters(res, validate, requiredFields, optionalFields) {
    var result = {};
    if (requiredFields) {
        for (var index in requiredFields) {
            var type = requiredFields[index];
            var use = validatorType(type);

            var found = false;
            for (var i = 0; i < validate.length; i++) {
                var value = validate[i][index];
                if (value) {
                    if (use(value)) {
                        result[index] = processType(type, value);
                        found = true;
                    } else {
                        sendErr(res, { error: 'Parameter "' + index + '" is not the correct data type.', id: null });
                        return false;
                    }
                    break;
                }
            }
            if (!found) {
                sendErr(res, { error: 'Parameter "' + index + '" is required.', id: null });
                return false;
            }
        }
    }
    if (optionalFields) {
        for (index in optionalFields) {
            type = optionalFields[index];
            use = validatorType(type);
            for (i = 0; i < validate.length; i++) {
                value = validate[i][index];
                if (value) {
                    if (use(value)) {
                        result[index] = processType(type, value);
                    } else {
                        sendErr(res, { error: 'Parameter "' + index + '" is not the correct data type.', id: null });
                        return false;
                    }
                    break;
                }
            }
        }
    }
    return result;
}

function authenticate(req, res, next) {
    if (req.body.key === key) {
        next();
    } else {
        sendErr(res, { error: 'Incorrect authentication key', id: null }, 401);
    }
}

function findUserIdMatch(id, array) {
    for (x in array) {
        if (array.userId == id) {
            return true, array[x]
        }
    }
    return false;
}

function secondsToHours(seconds) {
    return parseInt(seconds / 3600)
}

function updateGlobal(data) {
    client.redisClient.get(data.guild, function(err, reply) {
        if (reply) {
            var stored = JSON.parse(reply)
            stored[data.key] = data.value
            client.redisClient.set(data.guild, JSON.stringify(stored), function(err, rep) {
                console.log(err, rep)
            })
        } else {
            var newData = {}
            newData[data.key] = data.value
            client.redisClient.set(data.guild, JSON.stringify(newData), function(err, rep) {
                console.log(err, rep)
            })
        }
    })
}

function checkScammer(userId) {
    var https = require('request')
    var result = false
    https('https://avatar.roblox.com/v1/users/' + userId +'/currently-wearing', {json: true}, (err, res, body) => {
        if (body) {
            for (x in body.assetIds) {
                var id = body.assetIds[x]
                if (id == 6340101) {
                    console.log(`UserId ${userId} is not allowed.`)
                    Roblox.setRank(process.env.groupid, userId, 4)
                     .catch(function (err) {
                         console.log(err)
                     })
                   result = true
                   break;
                }
            }
        }
    });
    if (result == false) {
         client.channels.get('449982070597353472').send("Promoting **" + userId + "**...")
         Roblox.setRank(process.env.groupid, userId, 2)
          .then(function (newRole){
            client.channels.get('449982070597353472').send("Success! Promoted to " + newRole.Name);
         })
         .catch(function (err) {
            console.log("ERROR RANKING: " + err)
         }) 
    }
}

// Aliases and commands are put in collections where they can be read from,
// catalogued, listed, etc.
client.commands = new Enmap();
client.aliases = new Enmap();

// Now we integrate the use of Evie's awesome Enhanced Map module, which
// essentially saves a collection to disk. This is great for per-server configs,
// and makes things extremely easy for this purpose.
client.settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

client.collection = new Enmap({provider: new EnmapLevel({name: "enmapTest"})});

// set up redis
client.redisClient = redis.createClient({url: process.env.REDIS_URL})

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {
   // Roblox.post(4044556, "Second test: Hello world!")
  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
  
   // app stuff
  app.use(bodyParser.json())   
  app.post('/ping', authenticate, function(req, res, next) {
      let senderTime = req.body.sendTime
      let now = Date.now()
      let ping = now - senderTime
      res.send([ping, client.lastCommand])
  })
  
  app.post('/groupVerify', authenticate, function(req, res, next) {
      console.log(req.body)
      let userId = req.body.userId
      let success = false
      var rank = Roblox.getRankInGroup(process.env.groupid, userId)

      Roblox.setRank(process.env.groupid, userId, 3)
      .then(function (n) {
          success = true
      })
          
      if (rank >= 4) {
          success = true
      }
      res.send(success)
  })
  
  

  app.listen(process.env.PORT)
    
  // this keeps the app alive
    app.get("/", (request, response) => {
     // console.log(Date.now() + " Ping Received");
      response.sendStatus(200);
    });
    
    setInterval(() => {
      http.get(`http://technoturret.herokuapp.com/`);
    }, 120000);
    
    // use this to update
    setInterval(() => {
        client.config.prefix = process.env.prefix
    }, 60000)
    
    
    
    setInterval(() => { // auto rank users
      var https = require('request')
      var roblox = require('noblox.js')
      https('https://groups.roblox.com/v1/groups/'+ process.env.groupid +'/roles/28699298/users?sortOrder=Asc&limit=100', { json: true }, (err, res, body) => {
       
         if (err) {
             return;
         }
        // client.channels.get('449982070597353472').send(`There are ${body.data.length} user(s) waiting for a rank.`)
         if (body.data.length == 0) {
            // client.channels.get('449982070597353472').send("No users to promote!")
            return;
         }
         for (x in body.data) {
             var userData = body.data[x]
             if (!groupBanned[userData.userId]) {
                if (!userData.userId) {
                    // client.channels.get('449982070597353472').send("Could not promote a user!")
                    return;
                }
               var scammer = checkScammer(userData.userId)        
             };
             if (groupBanned[userData.userId]) {
                client.channels.get('449982070597353472').send(userData.username + " is not allowed into the WaterIsIceSoup group!")
             };
         };
      });
    }, 30000); // lazy af
    
    var loggedAssets = {}
    //var messageCheck = client.channels.get(process.env.channelid).fetchMessage(process.env.messageid).then(msg => { console.log("edit message redy") })
   
                
            
            
    setInterval(() => {
        var roblox = require('roblox-js')
        roblox.login("GCRBOT", process.env.rbxpass)
         .then(function () {
            console.log("Logged in!")
        });
    }, 8640000);
    
    setInterval(() => {
        let phrases = [
            ['WATCHING', 'you have fun.'],
            ['PLAYING', 'with your feelings.'],
            ['LISTENING', 'to the sweet sound of your voice'],
            ['STREAMING', 'commands to ' + client.guilds.size + ' servers!'],
            ['WATCHING', 'you through the window. Hi!'],
            ['PLAYING', 'with ice soup.'],
            ['LISTENING', 'for enemies!'],
            ['WATCHING', 'the sun set.'],
            ['PLAYING', 'on Discord! @Vanessa help']
        ]
        
        let buildVer = process.env.HEROKU_RELEASE_VERSION   
        let numb = buildVer.match(/\d/g);
        numb = numb.join("");
        numb = parseInt(numb)
        let ordinal = require("ordinal-js")
        function random(array) {
            return array[Math.floor(Math.random() * array.length)] || ['WATCHING', 'the ' + ordinal.toOrdinal(numb) + ' timeline. Use >help or ping me for help.']
                                                                          
        }
        let status = random(phrases)
        client.user.setActivity(status[1], {type: status[0]})
        .then(p => console.log(p))
        .catch(e => console.log(e))
        
    }, 60000)
        
  
  // Generate a cache of client permissions for pretty perms
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }
    
  // set up coin earning
  client.on('message', message => {
      if (message.author.bot) return;
      if (message.content.indexOf(client.config.prefix) == 0) return;
      
      if (message.guild) {
          let timeoutKey = message.author.id + "-" + message.guild.id
          let dataKey = message.author.id + "-" + message.guild.id + "-coins"
          if (!recentMessages.has(timeoutKey)) {
              recentMessages.add(timeoutKey) 
              setTimeout(() => {
                     recentMessages.delete(timeoutKey)
              }, 10000)
              let randCoins = Math.floor(Math.random() * 50) + 1
              client.redisClient.get(dataKey, function(err, reply) {
                  if (reply == null) {
                      client.redisClient.set(dataKey, randCoins, function(e, rep) {
                           //message.reply("you have " + rep + " coins homie (debugging message) and ur new")
                           updateGlobal({key: message.author.id, value: randCoins, guild: message.guild.id + "-globalcoins"})
                      })
                  } else {
                      client.redisClient.incrby(dataKey, randCoins, function(err, rep) {
                          if (rep) {
                           // message.reply("you have " + rep + " coins homie (debugging message)")
                            updateGlobal({key: message.author.id, value: rep, guild: message.guild.id + "-globalcoins"})
                          }
                      })
                  }
              })
          } else {
           // console.log("someone on message timeout: " + message.author.username)
          }
      } 
  })

  // Here we login the client.
  client.login(process.env.BOT_TOKEN);

// End top-level async/await function
    
};

init();
//await client.collection.defer;
//console.log(client.collection.size + " keys were loaded")

