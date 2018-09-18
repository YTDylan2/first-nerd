/*
updates!!
*/

exports.run = (client, message, args, level) => {
    var discord = require('discord.js')
    var request = require('request')
    
    let currentLog = ''
    let desc = null
    request('https://api.roblox.com/Marketplace/ProductInfo?assetId=1416632167', { json: true }, (err, res, body) => {
        if (err) {
            message.channel.send("Error retreiving update data!")
            return console.log(err);
        }
        const embed = new discord.RichEmbed()
        .setTitle("Updates")
        .setColor(process.env.purple)
        .setDescription(body.Description)        
        .setAuthor("Vanessa", client.user.avatarURL)
        .setFooter("arky smooth", client.user.avatarURL)
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
  category: "Info",
  description: "Displays any new updates available!",
  usage: "updates"
};
