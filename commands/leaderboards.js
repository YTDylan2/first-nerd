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
         let display = ""
          for (i = 0; i < 10; i++) {
             var userTable = leaders[i]
             //console.log("user table is " + userTable)
             if (userTable) {
                let member = client.users.get(userTable[0])
               // console.log(member + " (member)")
                if (member) {
                   let num = i + 1
                   display = display + (ordinal.toOrdinal(num) + ". **" + member.tag + "** - **" + userTable[1] + "** coins\n")
                }
             }
          }
         let embed = new discord.RichEmbed()
         .setTitle("Leaderboard")
         .addField("Top 10 Server Users", display + "\n\nVanessa")
         .setFooter("ya", client.user.avatarURL)
         .setTimestamp()
         .setColor(process.env.purple)
         message.channel.send({embed})
       }
   })
}
exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: ["leaders", "richest", "lb"],
    permLevel: "User"
};

exports.help = {
    name: "leaderboards",
    category: "Vault",
    description: "This command is disabled until the new Game system is set in place!",
    usage: "leaderboards"
};
