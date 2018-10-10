// coin leaders

exports.run = (client, message, args, level) => {
   var sorted = [];
   const discord = require('discord.js')
   const ordinal = require('ordinal-js')
   let guildKey = message.guild.id + "-DATA"

   client.getData(guildKey).then(response => {
       let data = JSON.parse(response)
       if (data) {
         let leaders = data.economy.leaderboards
         let embed = new discord.RichEmbed()
         .setTitle("Leaderboard")
         .addField("Top 10 Server Users", leaders + "\n\nVanessa")
         .setFooter("ya")
         .setTimestamp()
         message.channel.send({embed})
       }
   })
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["leaders", "richest", "lb"],
    permLevel: "User"
};

exports.help = {
    name: "leaderboards",
    category: "Economy",
    description: "Displays the top 10 in coin earning!",
    usage: "leaderboards"
};
