// kick user
async function checkMod(guild, member, client) {
  let passed = false
  let response = client.getGuildData(guild)
  let data = JSON.parse(response)
    if (!data) return;
    let modRoles = data.data.modRoles
    let adminRoles = data.data.adminRoles
    let memberRoles = member.roles
    let guildRoles = guild.roles

    if (modRoles[message.member.id]) {
      return true
    }
    if (adminRoles[message.member.id]) {
      return true
    }
    for (x in modRoles) {
      if (memberRoles.has(x) && guildRoles.find(r => r.id == x)) {
        return true
      }
    }
    for (x in adminRoles) {
      if (memberRoles.has(x) && guildRoles.find(r => r.id == x)) {
        return true
      }
    }

  return false
}
exports.run = (client, message, args, level) => {
    let user = message.mentions.members.first();
    var discord = require('discord.js')
    let reason = args[1]
    let realReason = reason || "Kicked by " + message.author.tag
    if (user) {
        checkMod(user).then(modStatus => {
          if (!modStatus) {
              user.kick(realReason).then(function (member) {
                  message.channel.send(`${member.user.tag} was kicked for ` + reason || "ungiven reason.")
              })
          } else {
              message.channel.send("That user is a moderator!")
          }
        })
    } else {
        message.channel.send("Could not kick! Please provide a user to kick!")
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["boot"],
    permLevel: "Moderator"
};

exports.help = {
    name: "kick",
    category: "Moderation",
    description: "Kicks a user from your server.",
    usage: "kick [user] [reason - optional]"
};
