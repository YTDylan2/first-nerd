const asyncredis = require("async-redis")
const moment = require("moment");
require("moment-duration-format");

module.exports = (client) => {

  // Random item function
  client.pickBoxItem = (boxType) => {
    function random(array) {
      return array[Math.floor(Math.random() * array.length)] || array[0]
    }
    const box = client.config.boxData[boxType]
    const items = client.config.boxItems
    if (!box) {
      return 'not found'
    }

    let juggle = []
    let returned = []

    for (x in box.Chances) {
      let chance = box.Chances[x]
      if (chance > 1) {
        for (i = 0; i < chance; i++) {
          juggle.push(x)
        }
      }
    }

    let chosenRarity = random(juggle)
    let itemChoices = items[chosenRarity]

    if (!itemChoices) {
      return 'items error'
    }
    let winner = random(itemChoices)
    return [winner, chosenRarity]



  }

  // Inspect data. In case any item updates occurred
  client.checkPlayerData = (pData) => {
    let data = pData
    let items = client.config.boxItems
    let defaultdata = client.config.defaultPlayerData
    let changed = false

    for (x in defaultdata) {
      if (!data[x]) {
        data[x] = defaultdata[x]
        changed = true
      }
    }

    for (id in data.inventory) {
      let playerItem = data.inventory[id]
      for (rarity in items) {
        let item = items[rarity].find(i => i.assetId == id)
        if (item) {
          playerItem.price = item.price
          playerItem.value = item.value
          playerItem.name = item.name
          changed = true
        }
      }
    }
    return [changed, data]
  }

  // Apply any bonuses
  client.checkBonus = (message, pData) => {
    let voted = client.voters[message.author.id]
    let changed = false

    let now = Date.now()
    let lastTime = pData.voterBonus[1]
    let timeOut = 43200000 // 12 hours

    if (voted) {
      if (now - lastTime < timeOut) {
        let timePassed = now - lastTime
        let format = moment.duration(timeOut - timePassed).format(" D [days], H [hours], m [minutes], s [seconds]");
        // False, the bonus has not expired yet
        return [false, format]
      } else {
        // True, the bonus has expired
        // Since they voted, give them the bonus
        pData.voterBonus = [true, now]
        changed = true
        return [true]
      }
    } else {
      // If they have not voted
      if (now - lastTime > timeOut) {
        // Their bonus has expired, lets take it away
        pData.voterBonus[0] = false
        changed = true
        return [true]
      }
    }

    if (changed) {
      client.getGuildData(message.guild).then(reply => {
        if (reply) {
          let gData = JSON.parse(reply)
          let playerData = gData.playerData.players
          let playerSave = playerData[member.author.id]
          if (playerSave) {
            playerSave = pData
            client.saveGuildData(message.guild, JSON.stringify(gData))
          }
        }
      })

    }
    return [false]
  }







  /*
  PERMISSION LEVEL FUNCTION

  */
  client.permlevel = (message, data) => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;

        if (currentLevel.check(message, client, data) ) {
        permlvl = currentLevel.level;
         break
        }


    }
    return permlvl;
  };


  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };
  // Remove all accented letters for queries
  client.removeAccents = function (strAccents) {
		var strAccents = strAccents.split('');
		var strAccentsOut = new Array();
		var strAccentsLen = strAccents.length;
		var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠš§§ŸÿýŽž';
		var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsSsYyyZz";
		for (var y = 0; y < strAccentsLen; y++) {
			if (accents.indexOf(strAccents[y]) != -1) {
				strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
			} else
				strAccentsOut[y] = strAccents[y];
		}
		strAccentsOut = strAccentsOut.join('');
		return strAccentsOut;
	}

  // Get all elements of an array after a certain index
client.getPastIndex = function (index, array) {
  let x;
  let args = []
  for (x in array) {
     if (x >= index) {
       args.push(array[x])
     }
  }
  return args
}

  // JSON to Array - Preserves keys
  client.jsonToArray = (json) => {
    let array = []
    for (x in json) {
      array.push([x, json[x]])
    }
    return array
  }

  // Data functions.
  client.getGuildData = async (guild) => {
    let data = await client.redisClient.get(guild.id + '-DATA')
    return data
  }

  client.saveGuildData = async (guild, value) => {
    let data = await client.redisClient.set(guild.id + '-DATA', value)
    return data
  }

  client.getData = async (key) => {
    let data = await client.redisClient.get(key)
    return data
  }

  client.incrby = async (key, value) => {
    await client.redisClient.incrby(key, value)
  }

  client.decrby = async (key, value) => {
    await client.redisClient.decrby(key, value)
  }

  client.setData = async (key, val) => {
    let data = await client.redisClient.set(key, val)
    return data
  }

  client.delData = async (key) => {
    let data = await client.redisClient.del(key)
    return data
  }

  // Find a guild user by name similarity
  client.findGuildUser = function(message, name) {
    if (!name || name === undefined) {
      return message.author
    }
    name = name.toLowerCase()
    let guild = message.guild
    let members = guild.members
    let filter = mem => mem.nickname && mem.nickname.toLowerCase().indexOf(name) == 0
    let filter2 = mem => mem.user && mem.user.username.toLowerCase().indexOf(name) == 0 || mem.user && mem.user.username.toLowerCase().match(name)
    let member = members.find(filter)
    if (!member) {
      member = members.find(filter2)
    }
    return member
  }


  client.extractDate = (dateObj) => {
    let month = dateObj.getMonth()
    let day = dateObj.getDate()
    let year = dateObj.getFullYear()
    return {
      month: month,
      day: day,
      year: year
    }
  }

  /*


  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      client.logger.log(`Loading Command: ${props.help.name}. 👌`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

// conversion of time from strings
client.convertTime = function(string) {
  function returnMultiplier(letter) {
    let times = {
	"m" : 60,
	"h" : 3600,
	"d" : 86400,
    }
    return times[letter]
   }
   if (!string) return;
   if (string.match("-")) return;
   let number = parseFloat(string.match(/[\d\.]+/))
   let r = string.replace(/[^a-zA-Z]+/g, '');
   let multiplier = returnMultiplier(r)
   if (number && multiplier) {
     return [number, multiplier]
   } else {
     return;
   }
}



  // <String>.toPropercase() returns a proper-cased string such as:
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };



  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // check permissions for discord
  client.checkPerm = function(guildMember, permissionName) {
    try {
      return guildMember.hasPermission(permissionName)
    } catch (e) {
      console.log('check perm fail: ' + e)
      // client.startChannel.send('check permission failure: ' + e)
    }
  }

  client.hastebin = async function(input) {
    const {post} = require('snekfetch')
    const { body } = await post('https://hastebin.com/documents').send(input)
    let key = body.key
    return "https://hastebin.com/" + key
  }
  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception:\n${errorMsg}`);

     if (client.startChannel) {
      client.startChannel.send("error, rebooting (check logs)")
     }
    process.exit(143);
  });

  process.on("unhandledRejection", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Unhandled rejection: ${errorMsg}`);
    if (client.startChannel) {
      client.startChannel.send("Unhandled Rejection\n" + client.clean(client, errorMsg) + "\nLast command used: " + client.lastCommand)
    }
  });

};
