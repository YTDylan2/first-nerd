exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    var discord = require('discord.js')
    var request = require('request')
    let member = message.mentions.members.first()
    var db = client.redisClient
    var postURL = 'https://presence.roblox.com/v1/presence/users'

   
    if (member) {
        let user = client.users.get(member.id)
        db.get(member.id, function(err, reply) {
            if (reply == null) {
                message.channel.send("this person isn't linked to ROBLOX.")
            } else { 
                message.channel.startTyping()
                roblox.getUsernameFromId(parseInt(reply))
                .then(username => {
                     roblox.getBlurb(reply)
                     .then(blurb => {
                         roblox.getStatus(reply)
                         .then(status => {                            
                             const embed = new discord.RichEmbed()
                                .setColor(4387926)
                                .setAuthor(user.tag, user.avatarURL)
                                .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${reply}&width=420&height=420&format=png`)
                                .addField("Username", username || 'Unresolvable')
                                .addField("User ID", reply || 'Unresolvable')
                                .addField("Bio", blurb || 'Nothing', true)
                                .addField("Feed", status || 'Nothing', true)
                                .addField("Profile Link", `https://roblox.com/users/${reply}/profile`)
                             message.channel.send({embed})     
                             message.channel.stopTyping(true)
                         })
                     })
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
    permLevel: "Bot Owner"
};

exports.help = {
    name: "roblox",
    category: "Roblox",
    description: "Get a roblox user from Discord!",
    usage: "roblox [username] or whois [username]"
};
