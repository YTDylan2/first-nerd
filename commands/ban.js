// ban user

async function checkMod(guild, member, client) {
  if (!member) return false;
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
    let user = args[0]
    var discord = require('discord.js')
    let reason = client.getPastIndex(1, args).join(" ")
    let realReason = reason + message.author.tag || "Banned by " + message.author.tag
    let perms = client.checkPerm(message.guild.members.get(client.id), "BAN_MEMBERS")
    if (!perms) {
     return message.channel.send(client.responseEmojis.fluster + " I need the permissions `BAN_MEMBERS` to do that! Please check my roles and try again.") 
    }
    if (user) {
      user = user.match(/\d+/g)[0]
      let member = message.guild.members.get(user)
      checkMod(message.guild, member, client).then(modStatus => {
        if (!modStatus) {
            user.send("You have been banned from " + message.guild.name + " for: " + reason)
            message.guild.ban(user, {reason: realReason, days: 1}).then(function (finished) {
              if (!member) {
                  message.channel.send(`**${"User ID **" + user + "** <@" + user + ">"}** was banned! Reason: ` + reason || "`ungiven reason.`")
              } else {
                  message.channel.send(`**${member.user.tag}** was banned! Reason: ` + reason || "`ungiven reason.`")
              }
            }).catch(e => {
              let strErr = e.toString()
              if (strErr.match("Permissions")) {
                message.channel.send("Missing permissions to ban this user!\nA). One role they have is above or equal my highest role position\nB). I am missing the `BAN_MEMBERS` permission")
              } else {
                if (level > 900) {
                  message.channel.send(strErr)
                }
                message.channel.send("Unknown error occurred.")
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
