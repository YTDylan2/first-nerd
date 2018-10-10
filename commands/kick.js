// kick user
function checkMod(guild, member) {
  let passed = false
  client.getGuildData(guild).then(response => {
    let data = JSON.parse(response)
    if (data) {
      let modRoles = data.data.modRoles
      let memberRoles = member.roles
      let guildRoles = guild.roles
      for (x in modRoles) {
        if (memberRoles.has(x) && guildRoles.find(r => r.id == x)) {
          passed = true
          break
        }
      }
    }
    if (modRoles[message.member.id]) {
      passed = true
    }
    return passed
}
exports.run = (client, message, args, level) => {
    let user = message.mentions.members.first();
    var discord = require('discord.js')
    let reason = args[1]
    let realReason = reason || "Kicked by " + message.author.tag
    if (&& user) {
        if (!checkMod(user)) {
            user.kick(realReason).then(function (member) {
                message.channel.send(`${user} was kicked for ` + reason || "ungiven reason.")
            })
        } else {
            message.channel.send("That user is a moderator!")
        }
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
