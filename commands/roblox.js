exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    var discord = require('discord.js')
    var request = require('request')
    let member = message.mentions.members.first()
    var db = client.redisClient
    var postURL = 'https://presence.roblox.com/v1/presence/users'

    message.channel.startTyping()
    if (member) {
        db.get(member.id, function(err, reply) {
            if (reply == null) {
                message.channel.send("this person isn't linked to ROBLOX.")
            } else { 
                roblox.getUsernameFromId(reply)
                .then(username => {
                     roblox.getBlurb(reply)
                     .then(blurb => {
                         roblox.getStatus(reply)
                         .then(status => {
                             var body = {"userIds" : [36051587]}
                             request.post(postURL, {form:body}, function(err, res, body) {
                                 if (body != undefined) {
                                     let user = body.userPresences[0]
                                     let lastLoc = user.lastLocation
                                      const embed = new Discord.RichEmbed()
                                        .setColor(4387926)
                                        .setAuthor(member.tag, member.avatarURL)
                                        .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${reply}&width=420&height=420&format=png`)
                                        .addField("Username", username)
                                        .addField("User ID", reply, true)
                                        .addField("Bio", blurb)
                                        .addField("Feed", status, true)
                                        .addField("Status", lastLoc)
                                     if (user.rootPlaceId) {
                                         embed.addField("Game Link", `https://www.roblox.com/games/${user.rootPlaceId}`, true)
                                     }
                                     message.channel.send({embed})
                                }
                             })
                         })
                     })
                })
            }
        })
    } else {
        message.channel.send("Please mention a user!")
    }
    message.channel.stopTyping()
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
