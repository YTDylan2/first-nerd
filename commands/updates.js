/*
updates!!
*/

exports.run = (client, message, args, level) => {
    var discord = require('discord.js')
    var request = require('request')
    let embed = new discord.RichEmbed()
    let currentLog = 'v1.12'
    request('https://api.roblox.com/Marketplace/ProductInfo?assetId=1416632167', { json: true }, (err, res, body) => {
        if (err) {
            message.channel.send("Error retreiving update data.")
            return console.log(err);
        }
        embed.addField(`**Updates for ${currentLog}**`, 'test')
        console.log(body)
        embed.setTitle("**Updates**")
        embed.setDescription("These are the updates for " + currentLog + ".")
        embed.setColor(6605055)
        embed.setAuthor("Aureum Studios | techno turret", 'https://imgur.com/WcypWFd')
        embed.setFooter("Provided by Aureum Studios", 'https://imgur.com/WcypWFd')
        embed.setTimestamp()
    });
    message.channel.send({ embed })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["updatelog"],
  permLevel: "User"
};

exports.help = {
  name: "updates",
  category: "System",
  description: "Displays any new updates available!",
  usage: "updates"
};
