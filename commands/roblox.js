exports.run = (client, message, args, level) => {
    var roblox = require('noblox.js')
    var discord = require('discord.js')
    var request = require('request')
    let member = message.mentions.members.first()


    if (member) {
        let user = client.users.get(member.id)
        client.getData(member.id).then(reply => {
            if (reply == null) {
                message.channel.send("This person isn't linked to my database.")
            } else {
                message.channel.startTyping()
                roblox.getPlayerInfo(parseInt(reply))
                .then(function(info) {
                      let embed = new discord.RichEmbed()
                      .setColor(4387926)
                      .setAuthor(user.tag, user.avatarURL)
                      .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${reply}&width=420&height=420&format=png`)
                      .addField("Username", info.username || 'Unresolvable')
                      .addField("User ID", reply || 'Unresolvable')
                      .addField("Bio", info.blurb || 'Nothing', true)
                      .addField("Feed", info.status || 'Nothing', true)
                      .addField("Account Age", info.age || 'Unresolvable')
                      .addField("Join Date", new Date(info.joinDate).toLocaleDateString() || 'Unresolvable')
                      .addField("Profile Link", `https://roblox.com/users/${reply}/profile`)
                   message.channel.send({embed})
                   message.channel.stopTyping(true)
                })
            }
        })
    } else {
        message.channel.send("Please mention a user!")
    }
    message.channel.stopTyping(true)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["whois"],
    permLevel: "User"
};

exports.help = {
    name: "roblox",
    category: "Roblox",
    description: "Get a roblox user from Discord!",
    usage: "roblox [username] or whois [username]"
};
