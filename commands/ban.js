// ban user

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
    let reason = args[1]
    let realReason = reason + message.author.tag || "Banned by " + message.author.tag
    if (user) {
      checkMod(message.guild, user, client).then(modStatus => {
        if (!modStatus) {
            user.ban(realReason).then(function (member) {
                message.channel.send(`**${member.user.tag}** was banned! Reason: ` + reason || "`ungiven reason.``")
            }).catch(e => {
              let strErr = e.toString()
              if (strErr.match("Permissions")) {
                message.channel.send("Missing permissions to ban this user!\nA). One role they have is above my highest role\nB). I am missing the `BAN_MEMBERS` permission")
              }
            })
        } else {
            message.channel.send("That user is a moderator!")
        }
      })
    } else {
        message.channel.send("Could not ban! Please provide a user to ban!")
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["hammer", "banland"],
    permLevel: "Administrator"
};

exports.help = {
    name: "ban",
    category: "Moderation",
    description: "Finally get rid of that annoying spammer!",
    usage: "ban [user] [reason - optional]"
};
