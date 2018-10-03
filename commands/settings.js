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
  let guildId = message.guild.id
  client.redisClient.get(guildId + "-SETTINGS", function(err, settings) {
    if (settings) {
      let modifiable = JSON.parse(settings)
      if (action == "edit") {
        if (!key) {
          return message.channel.send("Please provide a setting to edit!")
        }
        if (!value) {
          return message.channel.send("Please return a valid value for this key!")
        }
        if (!modifiable[key]) {
          return message.channel.send("That setting wasn't found!")
        }
        modifiable[key] = value
        if (key == "workEarnCooldown") {
          message.channel.send("Please note this setting is counted in seconds, setting this to `10` would give you a `10 second cooldown.`")
        }
        if (key == "crimeDeductionPercent") {
          message.channel.send("Please note this setting is based off how much money the user has at that moment.")
        }
        if (key == "crimeWinRate") {
          message.channel.send("This is out of 100.")
        }
        client.redisClient.set(guildId + "-SETTINGS", JSON.stringify(modifiable), function(fail, data) {
          message.channel.send(`Successfully updated **${key}** to **${value}**!`)
        })
      }
      if (action == "view" || !action) {
         let newArray = []
         let embed = new discord.RichEmbed()
         embed.setTitle("Setting Configuration")
         embed.setDescription("These are the settings for your guild! Say `" + settings.prefix + "edit (setting) (value)` to change it!")
         for (var i in modifiable) {
           newArray.push(`${i} => ${modifiable[i]}`)
         }
         let missingKeys = 0
         for (x in client.config.defaultSettings) {
           if (!modifiable[x]) {
             missingKeys = missingKeys + 1
           }
         }
         let str = newArray.join("\n")
         let modifiedStr = "```js\n" + str + "\n```"
         if (missingKeys > 0) {
           if (missingKeys > 0) {
             embed.addField("Important Notice", "**Reminder: You are missing **" + missingKeys + "** setting option(s)! Please use `settings update` to get the latest configuration info.")
           }
         }
         embed.addField("Settings", modifiedStr)
         embed.setFooter("ten millien fyreflys", client.user.avatarURL)
         message.channel.send({embed})

      }
      if (action == 'reset') {
        client.redisClient.set(guildId + "-SETTINGS", JSON.stringify(client.config.defaultSettings))
        message.channel.send("Default settings have been applied!")
      }
      if (action == "update") {
        let updatedKeys = 0
        let removed = 0
        for (x in client.config.defaultSettings) {
          if (!modifiable[x]) {
            updatedKeys = updatedKeys + 1
            modifiable[x] = client.config.defaultSettings[x]
          }
        }
        for (x in modifiable) {
          if (!client.config.defaultSettings[x]) {
            removed = removed + 1
            delete modifiable[x]
          }
        }
        if (updatedKeys > 0) {
          client.redisClient.set(guildId + "-SETTINGS", JSON.stringify(modifiable), function(err, reply) {
            message.channel.send("**" + updatedKeys + "** settings were added / updated.\n**" + removed + "** settings were removed.")
          })
        } else {
          message.channel.send("You have the latest setting configuration!")
        }

      }
    } else {
      client.redisClient.set(guildId + "-SETTINGS", JSON.stringify(client.config.defaultSettings))
      message.channel.send("Default settings have been applied!")
    }
  }

  })
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "set", "conf", "config"],
  permLevel: "Server Owner"
};

exports.help = {
  name: "settings",
  category: "System",
  description: "Configure server information!",
  usage: "settings [option, setting, value]\nsettings edit modRole Owner\nsettings update"
};
