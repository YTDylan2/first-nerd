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
    for (x in user.member.roles.array()) {
      let role = user.member.roles.array()[x]
      if (role.name !== "@everyone") {
        roles.push("<@&" + role.id + ">")
      }
    }
    count = roles.length
    roles = roles.join(", ")
    if (roles.length < 1) {
        roles = "None"
    }

    let joinDate = user.member.joinedAt
    let registerDate = user.createdAt

    let embed = new discord.RichEmbed()
    embed.setAuthor(user.tag, user.avatarURL)
    embed.setDescription("<@" + user.id + ">")
    embed.addField("Status on Discord", user.presence.status, true)
    embed.addField("Server Join Date", joinDate, true)
    embed.addField("Account Created at", registerDate, true)
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
