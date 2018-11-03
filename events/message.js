// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.
const moment = require("moment");
require("moment-duration-format");


function matchMention(text) {
   var mentionTag1 = '<@411683313926012928> '
   var mentionTag2 = '<@!411683313926012928> '
   if (text.indexOf(mentionTag1) == 0) {
     return text.slice(mentionTag1.length)
   }
   if (text.indexOf(mentionTag2) == 0) {
       return text.slice(mentionTag2.length)
   }
   return;
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

let recentMessages = new Set();
module.exports = (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot && message.author.id != '502233583864250368') return;
  if (!recentMessages[message.author.id]) {
    recentMessages[message.author.id] = {
      'commandCount' : 0,
      'alerted' : false
    }
  }

  let userCommandUsage = recentMessages[message.author.id]
  let ignoreList;






  // Grab the settings for this server from the PersistentCollection
  // If there is no guild, get default conf (DMs)

  // For ease of use in commands and functions, we'll attach the settings
  // to the message object, so `message.settings` is accessible.

   try {
     client.getData("Cleverbot Ignore List").then(request => {
       let list = request
       if (list) {
           let mentions = message.mentions.members
           let match =  matchMention(message.content)

           if (match || message.channel.type == 'dm') {
             // return message.channel.send("An issue is occurring internally with Cleverbot.io. This feature will be disabled until further notice.")
             // client.cleverbot.setNick("Main Session - " + message.author.id)
             client.cleverbot.create(function(bad, session) {
                if (!message.content.match('!ignore')) {

                   if (message.channel.type == 'dm') {
                     match = message.content
                   }
                   if (match == "cleverbot off") {
                     message.channel.send("Responding to you has been turned `off.` " + client.responseEmojis.wink)
                     list[message.author.id] = true
                     client.setData("Cleverbot Ignore List", JSON.stringify(list))
                     return
                   }
                   if (match == "cleverbot on") {
                     message.channel.send("Responding to you has been turned `on.`" + client.responseEmojis.wink)
                     delete list[message.author.id]
                     client.setData("Cleverbot Ignore List", JSON.stringify(list))
                     return
                   }
                   if (list[message.author.id]) return;
                   message.channel.startTyping()
                   client.cleverbot.ask(match, function(err, response) {
                      if (message.channel.type == 'dm') {
                        message.author.send(response)
                      } else {
                        if (message.author.id == '502233583864250368') {
                          message.channel.send('<@!' + message.author.id + '> ' + response)
                        } else {
                          message.channel.send(response + ' <@!' + message.author.id + '>')
                        }

                      }
                      message.channel.stopTyping()
                   })
                }
             })
          }
       } else {
          client.setData("Cleverbot Ignore List", JSON.stringify({}))
       }

     })
   } catch (e) {
     return message.channel.send("Uhhm... an error didn't just totally occur... " + client.responseEmojis.fluster)
   }


   let id;
   if (message.guild) {
      id = message.guild.id
   } else {
      id = '0'
   }
   client.getData(id + "-DATA").then(response => {
      let data = JSON.parse(response)
      if (data) {
        if (!data.economy.players[message.author.id]) {
          data.economy.players[message.author.id] = {
            'coins': 25,
            'daily': Math.pow(2, 25)
          }
          client.setData(id + '-DATA', JSON.stringify(data))
        }
      }
      if (!data) {
         data = client.config.defaultSettings
      }

      let settings = data.settings
      message.settings = settings;

      let ignoredChannels = data.data.ignoredChannels
      let disabledCommands = data.data.disabledCommands
      let disabledCategories = data.data.disabledCategories


      // Also good practice to ignore any message that does not start with our prefix,
      // which is set in the configuration file.
      if (!message.content.indexOf(settings.prefix !== 0) && message.content.indexOf(settings.prefix.toUpperCase()) !== 0 || message.content.indexOf(client.config.prefix !== 0) && message.content.indexOf(client.config.prefix.toUpperCase()) !== 0) {
       // in case of a ping for an argument
        let user = message.mentions.members.first()
        if (user) {
          client.getData("AFK").then(reply => {
            let list = JSON.parse(reply)
            if (list[user.id]) {
              if (list[message.author.id]) {
                delete list[message.author.id]
                client.setData("AFK", JSON.stringify(list))
                message.channel.send(client.responseEmojis.wave + " Welcome back <@" + message.author.id + ">! I removed your AFK status.")
                return 
              }
              let reason = list[user.id][0]
              let timeAfk = list[user.id][1]

              let now = Date.now()
              let elapsed = now - timeAfk
              let format = moment.duration(elapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
              message.channel.send(user.user.username + " has been AFK for " + format + ": " + reason)
            }
          })
        } else {
          client.getData("AFK").then(reply => {
            let list = JSON.parse(reply)
            if (list[message.author.id]) {
              delete list[message.author.id]
              message.channel.send(client.responseEmojis.wave + " Welcome back <@" + message.author.id + ">! I removed your AFK status.")
              client.setData("AFK", JSON.stringify(list))
              return 
            }
          })
        }
        return  
      }

      // Here we separate our "command" name, and our "arguments" for the command.
      // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
      // command = say
      // args = ["Is", "this", "the", "real", "life?"]
      const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      // Get the user or member's permission level from the elevation
      const level = client.permlevel(message, data);

      // Check whether the command, or alias, exist in the collections defined
      // in app.js.
      const cmd = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()));
      // using this const varName = thing OR otherthign; is a pretty efficient
      // and clean way to grab one of 2 values!
      // clever bot

      if (!cmd) return;


      if (userCommandUsage.commandCount >= 3) {
        if (!userCommandUsage.alerted) {
          userCommandUsage.alerted = true
          message.channel.send(client.responseEmojis.wtf + " You're using the commands way too fast! You've been placed on a 10 second cooldown!\n(3 commands in 10 seconds)")
        }
        setTimeout(() => {
          userCommandUsage.commandCount = 0
          userCommandUsage.alerted = false
        }, 10000)
      }

      if (userCommandUsage.commandCount >= 3) {
        return;
      }
      // Some commands may not be useable in DMs. This check prevents those commands from running
      // and return a friendly error message.
      if (cmd && !message.guild && cmd.conf.guildOnly)
       return message.channel.send("Sorry, but this command is guild only! " + client.responseEmojis.scream);

      if (level < client.levelCache[cmd.conf.permLevel]) {
         return message.channel.send(client.responseEmojis.fluster + ` Hehe... you need to be atleast at the **(${cmd.conf.permLevel})** level to use this command!`)
      }

      // don't run if disabled
      if (cmd.conf.enabled == false) {
         return message.author.send("That command is disabled!")
      }

      // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
      // The "level" command module argument will be deprecated in the future.
      message.author.permLevel = level;
      if (ignoredChannels[message.channel.id] && level < 3) return;
      if (disabledCommands[cmd.help.name] && level < 3) {
        return message.channel.send("This command is disabled for this guild! " + client.responseEmojis.scream)
      }
      if (disabledCategories[cmd.help.category]) {
        return message.channel.send("This command's category is disabled. (**" + cmd.help.category + "**)" + client.responseEmojis.scream)
      }

      message.flags = [];
      while (args[0] && args[0][0] === "-") {
       message.flags.push(args.shift().slice(1));
      }
      // If the command exists, **AND** the user has permission, run it.
      client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
      client.lastCommand = settings.prefix + cmd.help.name
      try {
        cmd.run(client, message, args, level);
      } catch (e) {
        if (level > 900) {
          message.channel.send("There was an internal error when executing this command!\nError: `" + e + "`")
          return
        }
      }

      userCommandUsage.commandCount = userCommandUsage.commandCount + 1

      setTimeout(() => {
        if (userCommandUsage.commandCount < 3 && !userCommandUsage.alerted) {
          userCommandUsage.commandCount = 0
        }
      }, 750)
  })
};
