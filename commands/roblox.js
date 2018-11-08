exports.run = (client, message, args, level) => {
    var roblox = require('noblox.js')
    var discord = require('discord.js')
    var request = require('request')
    let member = message.mentions.members.first() || client.findGuildUser(message, args.join(" "))
    if (!member) {
      message.channel.stopTyping(true)
      return message.channel.send("Could not find info for the person you are looking for.\nAre you looking for a **roblox user on the website?** If so, use `>rbxuser " + args.join(" ") + "`")
    }
    member = member.user || member

    if (member) {
        let user = client.users.get(member.id)
        client.getData(member.id).then(reply => {
            if (reply == null) {
                return message.channel.send("Could not find info for the person you are looking for.\nAre you looking for a **roblox user on the website?** If so, use `>rbxuser " + args.join(" ") + "`")
                message.channel.stopTyping(true)
            } else {
                message.channel.startTyping()
                roblox.getPlayerInfo(parseInt(reply))
                .then(function(info) {
                      let date = new Date(info.joinDate)
                      let dateInfo = client.extractDate(date)
                      let embed = new discord.RichEmbed()
                      .setColor(4387926)
                      .setAuthor(user.tag, user.avatarURL)
                      .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${reply}&width=420&height=420&format=png`)
                      .addField("Username", info.username || 'Unresolvable')
                      .addField("User ID", reply || 'Unresolvable')
                      .addField("Bio", info.blurb || 'Nothing', true)
                      .addField("Feed", info.status || 'Nothing', true)
                      .addField("Account Age", info.age || 'Unresolvable')
                      .addField("Join Date", `${dateInfo.month}/${dateInfo.day}/${dateInfo.year}` || 'Unresolvable')
                      .addField("Profile Link", `https://roblox.com/users/${reply}/profile`)
                   message.channel.send({embed})
                   message.channel.stopTyping(true)
                })
            }
        })
    } else {
        message.channel.send("Please provide a user!")
    }
    message.channel.stopTyping(true)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["rbx"],
    permLevel: "User"
};

exports.help = {
    name: "roblox",
    category: "Roblox",
    description: "Get a roblox user from Discord!",
    usage: "roblox [username] or whois [username]"
};
