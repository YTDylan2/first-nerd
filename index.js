// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.

// REDIS ***NEEDS*** A CALLBACK FUNCTION
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Load up the discord.js library
const Discord = require("discord.js");
const Roblox = require("roblox-js");
const Noblox = require("noblox.js")
const express = require("express");
const bodyParser = require('body-parser')
const validator = require('validator')
const http = require('http')
var app = express();
var key = process.env.key
// We also load the rest of the things we need in this file:
const { promisify } = require("util");
const util = require("util")
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const rethink = require("rethinkdb")
const EnmapRethink = require('enmap-rethink')
const redis = require('redis')
const asyncredis = require("async-redis")
const cleverbot = require('cleverbot.io')
const ordinal = require('ordinal-js')
const discordbotlist = require('dblapi.js')
const recentMessages = new Set();


// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're refering to. Your client.
const client = new Discord.Client();
const dbl = new discordbotlist(process.env.DBL_KEY, client)

client.botlistclient = dbl

dbl.on('posted', () => {
  console.log("Server count was posted!")
})



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
app.use(bodyParser.json())
app.listen(process.env.PORT || 3000, function() {
  console.log("Running on port " + process.env.PORT)
})

// Set up some client objects / values
client.lastCommand = "None"
client.galaxyClickerGuildID = '501860458626547721'
client.voters = {}
client.allowRandomStatuses = true

client.cleverbot = new cleverbot(process.env.cbname, process.env.cbkey)
client.cleverbot.setNick("Main Session")

Roblox.login({username: process.env.rbxname, password: process.env.rbxpass})
    .then(function () {
        console.log("Logged in to ROBLOX!")
        // client.startChannel.send('sucessfully opened a roblox session as ' + process.env.rbxname)
    })
    .catch(function(err) {
        console.log("login error: " + err)
        // client.startChannel.send('there was a login error, check logs')
    });

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
            }
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

client.updateGlobal = function(guild) {
  client.getGuildData(guild).then(response => {
    if (response) {

    }
  })
}

client.updateGuilds = async function() {
  let guildz = client.guilds.array()
  let updated = []
  for (id in guildz) {
    let guild = guildz[id]
    let response = await client.getGuildData(guild)
      let gData = JSON.parse(response)
      if (!gData) {
        client.saveGuildData(guild, JSON.stringify(client.config.defaultSettings))
        console.log("Default settings applied for guild " + guild.id)
        updated.push(guild.id)
      } else {
        let modifiable = gData
        let updatedKeys = 0
        let removed = 0
        for (x in client.config.defaultSettings) {
          let section = modifiable[x]
          if (!modifiable[x]) {
            updatedKeys = updatedKeys + 1
            modifiable[x] = client.config.defaultSettings[x]
          } else {
            for (key in client.config.defaultSettings[x]) {
              if (!section[key]) {
                updatedKeys = updatedKeys + 1
                section[key] = client.config.defaultSettings[x][key]
              }
            }
          }
        }
        for (x in modifiable) {
          if (!client.config.defaultSettings.settings[x]) {
            removed = removed + 1
            delete modifiable.settings[x]
          }
        }
        if (updatedKeys > 0) {
          client.saveGuildData(guild, JSON.stringify(modifiable)).then(rep => {
            console.log(updatedKeys + " settings were added / updated.\n" + removed + " settings were removed.\nGuild " + guild.id)
          })
        }
      }
  }
  return updated.length + " updated"

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


// set up redis
client.redisClient = redis.createClient({url: process.env.REDIS_URL})
asyncredis.decorate(client.redisClient)

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {
   // Roblox.post(4044556, "Second test: Hello world!")
  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  //client.startChannel.send(`${cmdFiles.length} commands were loaded`)
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

  client.postingChannel = client.channels.get('500726748229664769')
  client.startChannel = client.channels.get('491777217920106508')
  client.getData("GC:Re Collectibles").then(reply => {
      client.galaxyClickerItems = JSON.parse(reply)
  })


   // app stuff\
  app.use(express.static('./public'))

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

  app.post('/getCollectibles', authenticate, function(req, res) {
    client.setData("GC:Re Collectibles", JSON.stringify(req.body.info)).then(reply => {
      client.galaxyClickerItems = req.body.info
    })
    res.send("Transfer completed!")
  })




  // this keeps the app alive
    app.get("/", (request, response) => {
     // console.log(Date.now() + " Ping Received");
      response.sendStatus(200);
    });

    setInterval(() => {
      http.get(`http://technoturret.herokuapp.com/`);
    }, 360000);

    // use this to update



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

    // roblox events




    setInterval(() => {
        var roblox = require('roblox-js')
        roblox.login(process.env.rbxname, process.env.rbxpass)
         .then(function () {
            console.log("Logged in!")
            client.startChannel.send('renewed ROBLOX login')
        });
    }, 8640000);

    setInterval(() => {
        Roblox.post(process.env.groupid, "Do you want access to chat on our group wall? Please join this game and I will assign the chatting rank to you! http://www.roblox.com/games/2260793709/Get-your-Ice-Soup-rank")
    }, 57600000)

    setInterval(() => {

        if (client.allowRandomStatuses) {
          let ordinal = require("ordinal-js")
          let buildVer = process.env.HEROKU_RELEASE_VERSION
          let numb = buildVer.match(/\d/g);
          numb = numb.join("");
          numb = parseInt(numb)

          let phrases = [
              ['WATCHING', 'you have fun.'],
              ['PLAYING', 'with your feelings.'],
              ['LISTENING', 'the sweet sound of your voice'],
              ['STREAMING', 'commands to ' + client.guilds.size + ' servers!'],
              ['WATCHING', 'you through the window. Hi!'],
              ['PLAYING', 'with ice soup.'],
              ['LISTENING', 'the bushes for enemies!'],
              ['WATCHING', 'the sun set.'],
              ['PLAYING', 'on Discord! >help'],
              ['STREAMING', 'commands! >help'],
              ['LISTENING', 'this song on repeat for the ' + ordinal.toOrdinal(Math.floor(Math.random() * 101)) + ' time!'],
              ['WATCHING', 'the ' + ordinal.toOrdinal(numb) + ' timeline. Use >help or ping me for help.'],
              ['PLAYING', 'Use @Vanessa help | help water has taken me hostage!'], // lollipopwut
          ]



          function random(array) {
              return array[Math.floor(Math.random() * array.length)] || ['WATCHING', 'the ' + ordinal.toOrdinal(numb) + ' timeline. Use >help or ping me for help.']

          }
          let status = random(phrases)
          client.user.setActivity(status[1], {type: status[0]})
          .catch(e => console.log(e))
          client.updateGuilds()
        }
        client.botlistclient.getVotes().then(votes => {
          for(x in votes) {
            let vote = votes[x]
            client.voters[vote.id] = true
          }
        })
    }, 60000)



  // Generate a cache of client permissions for pretty perms
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }


  // Here we login the client.
  client.login(process.env.BOT_TOKEN);


// End top-level async/await function

};

init();
//await client.collection.defer;
//console.log(client.collection.size + " keys were loaded")
