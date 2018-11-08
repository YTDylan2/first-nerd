const discord = require('discord.js');

exports.run = async (client, message, args, level) => {
    let user = client.findGuildUser(message, args.join(" "))

    if (message.mentions.members) {
        if (message.mentions.members.first()) {
            user = message.mentions.members.first().user
        }
    }

    user = user.user || user

    let roles = []
    let count = 0;
    let member = message.guild.members.find(m => m.id == user.id)
    user.member = member // incase
    let userRoles = user.member.roles.array()
    userRoles.sort(function(a, b) {
      return b.position - a.position
    })

    for (x in userRoles) {
      let role = userRoles[x]
      if (role.name !== "@everyone") {
        roles.push("<@&" + role.id + ">")
      }
    }
    count = roles.length
    roles = roles.join(", ")
    if (roles.length < 1) {
        roles = "None"
    }

    let joinDate = client.extractDate(user.member.joinedAt)
    let registerDate = client.extractDate(user.createdAt)

    let embed = new discord.RichEmbed()
    embed.setAuthor(user.tag, user.avatarURL)
    embed.setDescription("<@" + user.id + ">\nRoles are in descending order, beginning with the highest role.")
    embed.addField("Status on Discord", user.presence.status, true)
    embed.addField("Server Join Date", `${joinDate.month}/${joinDate.day}/${joinDate.year}`, true)
    embed.addField("Account Created at", `${registerDate.month}/${registerDate.day}/${registerDate.year}`, true)
    embed.setThumbnail(user.avatarURL)
    embed.addField("Original Avatar Picture", user.defaultAvatarURL, true)
    embed.addField("Roles [" + count + "]", roles, true)
    embed.setFooter("User ID: " + user.id)
    embed.setTimestamp()
    embed.setColor(process.env.purple)
    message.channel.send({embed})
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["whois"],
    permLevel: "User"
};

exports.help = {
    name: "userinfo",
    category: "Info",
    description: "Gets the information of another user.",
    usage: "userinfo [user]"
};
