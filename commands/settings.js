const { inspect } = require("util");
const redis = require('redis')
const discord = require('discord.js')

// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
exports.run = (client, message, [action, key, value], level) => { // eslint-disable-line no-unused-vars
  let guild = message.guild
  let guildId = guild.id
  client.getGuildData(guild).then(settings => {
    if (settings) {
      let modifiable = JSON.parse(settings)
      if (action == "edit") {
        if (!key) {
          return message.channel.send("Please provide a setting to edit!")
        }
        if (!value) {
          return message.channel.send("Please return a valid value for this key!")
        }
        if (!modifiable.settings[key]) {
          return message.channel.send("That setting wasn't found!")
        }
        modifiable.settings[key] = value
        if (key == "workEarnCooldown") {
          message.channel.send("Please note this setting is counted in seconds, setting this to `10` would give you a `10 second cooldown.`")
        }
        if (key == "crimeDeductionPercent") {
          message.channel.send("Please note this setting is based off how much money the user has at that moment.")
        }
        if (key == "crimeWinRate") {
          message.channel.send("This is out of 100 percent. Settings this to 35% sets the crime winning rate to 35%.")
        }
        client.redisClient.set(guildId + "-DATA", JSON.stringify(modifiable), function(fail, data) {
          message.channel.send(`Successfully updated **${key}** to **${value}**!`)
        })
      }
      if (action == "view" || !action) {
         let newArray = []
         let embed = new discord.RichEmbed()
         embed.setTitle("Setting Configuration")
         embed.setDescription("These are the settings for your guild! Say `>settings edit (setting) (value)` to change it!")
         for (var i in modifiable.settings) {
           newArray.push(`${i} => ${modifiable.settings[i]}`)
         }
         let missingKeys = 0
         for (x in client.config.defaultSettings.settings) {
           if (!modifiable.settings[x]) {
             missingKeys = missingKeys + 1
           }
         }
         for (x in client.config.defaultSettings.data) {
           if (!modifiable.data[x]) {
             missingKeys = missingKeys + 1
           }
         }
         let str = newArray.join("\n")
         let modifiedStr = "```js\n" + str + "\n```"
         if (missingKeys > 0) {
           if (missingKeys > 0) {
             embed.addField("Important Notice", "**Reminder: You are missing " + missingKeys + "** setting option(s)!\nPlease use `settings update` to get the latest configuration info.")
           }
         }
         embed.addField("Settings", modifiedStr)
         embed.setFooter("ten millien fyreflys", client.user.avatarURL)
         embed.setColor(process.env.purple)
         message.channel.send({embed})

      }
      if (action == "viewall") {
        let prettyPrint = "{\n"
        for (x in modifiable) {
          let dataString = ""
          for (key in modifiable[x]) {
            dataString = dataString + `${key} => ${modifiable[x][key]}\n`
          }
          prettyPrint = prettyPrint + `${x} => {\n\t` + dataString + '\n}'
        }
        client.hastebin(prettyPrint).then(link => {
          message.channel.send("Your guild's entire data has been uploaded to " + link + ".js")
        })
      }
      if (action == 'reset') {
        client.redisClient.set(guildId + "-DATA", JSON.stringify(client.config.defaultSettings))
        message.channel.send("Default settings have been applied!")
      }
      if (action == "update") {
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
          client.redisClient.set(guildId + "-DATA", JSON.stringify(modifiable).then(rep => {       
            message.channel.send("**" + updatedKeys + "** settings were added / updated.\n**" + removed + "** settings were removed.")
          })
        } else {
          message.channel.send("You have the latest setting configuration!")
        }

      }
    } else {
      client.setData(guildId + "-DATA", JSON.stringify(client.config.defaultSettings))
      message.channel.send("Default settings have been applied!")
    }


  })

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "set", "conf", "config"],
  permLevel: "Server Owner",
  subCommands: [
    "edit - Used to edit a setting.\n`>settings edit prefix !`\n`>settings edit workEarnMax 2400`",
    "view - Used to view settings.\n`>settings view`",
    "reset - Applies default settings.\n`>settings reset`",
    "update - Updates settings.\n`>settings update`"
  ]
};

exports.help = {
  name: "settings",
  category: "System",
  description: "Configure server information!",
  usage: "settings [option, setting, value]\nsettings edit modRole Owner\nsettings update"
};
