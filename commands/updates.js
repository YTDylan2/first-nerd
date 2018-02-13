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
        const embed = new discord.RichEmbed()
        .addField(`**Updates for ${currentLog}**`, body.Description)
        .setTitle("**Updates**")
        .setDescription("These are the updates for " + currentLog + ".")
        .setColor(6605055)
        .setAuthor("Aureum Studios | techno turret", 'https://i.imgur.com/WcypWFd.png')
        .setFooter("Provided by Aureum Studios", 'https://i.imgur.com/WcypWFd.png')
        .setTimestamp()
        message.channel.send({embed})
        
    });
    
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
