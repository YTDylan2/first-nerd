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
    let reason = client.getPastIndex(1, args)
    let realReason = reason + message.author.tag || "Softbanned by " + message.author.tag
    if (user) {
      user = user.match(/\d+/g)[0]
      let member = message.guild.members.get(user)
      checkMod(message.guild, member, client).then(modStatus => {
        if (!modStatus) {
            message.guild.ban(user, {reason: realReason}).then(function (newuser) {
                message.guild.unban(user, {reason: "Unbanning for softban: " + user}).then(finish => {
                  message.channel.send(`**${finish.tag}** was successfully softbanned.`)
                }).catch(e => {
                  message.channel.send("Something went wrong! I was able to ban the user, but unable to unban them. You may need to do that manually.")
                })
            }).catch(e => {
              let strErr = e.toString()
              if (strErr.match("Permissions")) {
                message.channel.send("Missing permissions to softban this user!\nA). One role they have is above or equal my highest role position\nB). I am missing the `BAN_MEMBERS` permission")
              }
            })
        } else {
            message.channel.send("That user is a moderator!")
        }
      })
    } else {
        message.channel.send("Please provide a user to softban!")
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["sban"],
    permLevel: "Moderator"
};

exports.help = {
    name: "softban",
    category: "Moderation",
    description: "A quick ban to delete messages from a user.",
    usage: "softban [user] [reason - optional]"
};
