const asyncredis = require("async-redis")

module.exports = (client) => {

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

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

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
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
  client.findGuildUser = function(guild, name) {
    name = name.toLowerCase()
    let members = guild.members
    let filter = mem => mem.nickname && mem.nickname.toLowerCase().indexOf(name) == 0 || mem.nickname && mem.nickname.toLowerCase().match(name)
    let filter2 = mem => mem.user && mem.user.username.toLowerCase().indexOf(name) == 0 || mem.user && mem.user.username.toLowerCase().match(name)
    let member = members.find(filter)
    if (!member) {
      member = members.find(filter2)
    }
    return member
  }

  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
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

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code.

  // <String>.toPropercase() returns a proper-cased string such as:
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  // Array.prototype.random = function() {
  //  return this[Math.floor(Math.random() * this.length)]
  // };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // check permissions for discord
  client.checkPerm = function(guildMember, permissionName) {
    try {
      return guildMember.hasPermission(permissionName)
    } catch (e) {
      console.log('check perm fail: ' + e)
      client.startChannel.send('check permission failure: ' + e)
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
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    // Always best practice to let the code crash on uncaught exceptions.
    // Because you should be catching them anyway.
     if (client.startChannel) {
      client.startChannel.send("error, rebooting (check logs)")
     }
    process.exit(143);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
    if (client.startChannel) {
      client.startChannel.send("unhandled rejection: " + err + "\nlast known command used: " + client.lastCommand)
    }
  });

};
