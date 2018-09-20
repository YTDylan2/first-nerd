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
exports.run = (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars
  let guildId = message.guild.id
  client.redisClient.get(guildId + "-SETTINGS", function(err, settings) {
    if (settings) {
      let modifiable = JSON.parse(settings)
      if (action == "edit") {
        if (!key) {
          return message.channel.send("Please provide a setting to edit!")
        }
        if (!value) {
          return message.channel.send("Please send a proper value for the setting!")
        }
        if (!modifiable[key]) {
          return message.channel.send("That setting wasn't found!")
        }
        modifiable[key] = value
        client.redisClient.set(guildId + "-SETTINGS", modifiable, function(fail, data) {
          message.channel.send(`Successfully updated **${key}** to **${value}**!`)
        })
      }
    }
  })
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf", "config"],
  permLevel: "Administrator"
};

exports.help = {
  name: "set",
  category: "System",
  description: "Configure server information!",
  usage: "set [option, setting, value]\nset edit modRole Owner"
};
