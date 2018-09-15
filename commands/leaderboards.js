// coin leaders

exports.run = (client, message, args, level) => {
   var sorted = [];
   const discord = require('discord.js')
   const ordinal = require('ordinal-js')
   
   client.redisClient.get("Global Coins", function(err, data) {
       if (data) {
         let parsed = JSON.parse(data)
         for (x in parsed) {
            sorted.push([x + '', parsed[x]])
         }
         sorted.sort(function(a, b) {
            return b[1] - a[1]
         })

         let display = ""
         for (i = 0; i <= 10; i++) {
            var userTable = sorted[i]
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
         const embed = new discord.RichEmbed()
         .setTitle("Top 25 Global Users")
         .addField("List", display + "\nhey there")
         .setColor(6579455)

        message.channel.send({embed})
       } else {
          message.channel.send("nobody on the leaderboards yet b")
       }
   })
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["leaders"],
    permLevel: "User"
};

exports.help = {
    name: "leaderboards",
    category: "Economy",
    description: "Displays the top 10 in coin earning!",
    usage: "leaderboards"
};
