const { inspect } = require("util");
const redis = require('redis')

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
        if (key == "coinEarnCooldown") {
          message.channel.send("Please note this setting is counted in seconds., setting this to `10` would give you a `10 second cooldown.`")
        }
        client.redisClient.set(guildId + "-SETTINGS", JSON.stringify(modifiable), function(fail, data) {
          message.channel.send(`Successfully updated **${key}** to **${value}**!`)
        })
      }
      if (action == "view") {
         let newArray = []
         for (var i in modifiable) {
           newArray.push(`${i}: ${modifiable[i]}`)
         }
         let str = newArray.join("\n")
         message.channel.send(str, {code: 'asciidoc'})
      }
      if (action == 'reset') {
        client.redisClient.set(guildId + "-SETTINGS", JSON.stringify(client.config.defaultSettings))
        message.channel.send("Default settings have been applied!")
      }
      if (action == "update") {
        let updatedKeys = 0
        for (x in client.config.defaultSettings) {
          if (!modifiable[x]) {
            updatedKeys = updatedKeys + 1
            modifiable[x] = client.config.defaultSettings[x]
          }
        }
        if (updatedKeys > 0) {
          client.redisClient.set(guildId + "-SETTINGS", JSON.stringify(modifiable), function(err, reply) {
            message.channel.send("**" + updatedKeys + "** keys were added / updated.")
          })
        } else {
          message.channel.send("You have the latest key configuration!")
        }

      }
    } else {
      client.redisClient.set(guildId + "-SETTINGS", JSON.stringify(client.config.defaultSettings))
      message.channel.send("Default settings have been applied!")
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
  usage: "settings [option, setting, value]\nset edit modRole Owner"
};
