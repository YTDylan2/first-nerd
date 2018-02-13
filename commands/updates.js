/*
updates!!
*/

exports.run = (client, message, args, level) => {
    var discord = require('discord.js')
    var request = require('request')
    
    let currentLog = 'v1.12'
    let desc = null
    request('https://api.roblox.com/Marketplace/ProductInfo?assetId=1416632167', { json: true }, (err, res, body) => {
        if (err) {
            message.channel.send("Error retreiving update data.")
            return console.log(err);
        }
        desc = body.Description
        console.log(body)
        
    });
    const embed = new discord.RichEmbed()
    .addField(`**Updates for ${currentLog}**`, desc)
    .setTitle("**Updates**")
    .setDescription("These are the updates for " + currentLog + ".")
    .setColor(6605055)
    .setAuthor("Aureum Studios | techno turret", 'https://imgur.com/WcypWFd')
    .setFooter("Provided by Aureum Studios", 'https://imgur.com/WcypWFd')
    .setTimestamp()
    message.channel.send({embed})
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
