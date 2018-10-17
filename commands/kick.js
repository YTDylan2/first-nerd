// kick user
async function checkMod(guild, member, client) {
  let passed = false
  let response = await client.getGuildData(guild)
  let data = JSON.parse(response)
    if (!data) return;
    let modRoles = data.data.modRoles
    let adminRoles = data.data.adminRoles
    let memberRoles = member.roles
    let guildRoles = guild.roles

    if (modRoles[member.id]) {
      return true
    }
    if (adminRoles[member.id]) {
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
    let reason = args.join(" ")
    let realReason = reason || "Kicked by " + message.author.tag
    if (user) {
      reason = reason.replace("<@" + user.id + ">", "")
        checkMod(message.guild, user, client).then(modStatus => {
          if (!modStatus) {
              user.kick(realReason).then(function (member) {
                  message.channel.send(`**${member.user.tag}** was kicked! Reason: ` + reason || "`ungiven reason.``")
              }).catch(e => {
                let strErr = e.toString()
                if (strErr.match("Permissions")) {
                  message.channel.send("Missing permissions to kick this user!\nA). One role they have is above or equal my highest role position\nB). I am missing the `KICK_MEMBERS` permission")
                }
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
