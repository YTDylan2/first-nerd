// ban user

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
    })
    if (modRoles[message.member.id]) {
      passed = true
    }
    return passed
}
exports.run = (client, message, args, level) => {
    let user = message.mentions.members.first();
    var discord = require('discord.js')
    let reason = args[1]
    let realReason = reason || "Banned by " + message.author.tag
    if (&& user) {
        if (!checkMod(user)) {
            user.kick(realReason).then(function (member) {
                message.channel.send(`${user} was banned for ` + reason || "ungiven reason.")
            })
        } else {
            message.channel.send("That user is a moderator!")
        }
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
