// coin leaders

exports.run = (client, message, args, level) => {
   var sorted = [];
   var discord = require('discord.js')
   
   client.redisClient.get("Global Coins", function(err, data) {
       if (data) {
         let parsed = JSON.parse(data)
         for (x in parsed) {
            sorted.push([x + '', parsed[x]])
         }
         sorted.sort(function(a, b) {
            return a[1] - b[1]
         })

         let display = ""
         for (i = 0; i < 25; i++) {
            var userTable = sorted[i]
            console.log("user table is " + userTable)
            if (userTable) {
               let member = client.users.get(userTable[0])
               console.log(member + " (member)")
               if (member) {
                  display = display + (i + ". **" + member.tag + "** - **" + userTable[1] + "** coins\n")
               }
            }
         }
         const embed = new discord.RichEmbed()
         .setTitle("Top 25 Global Users")
         .addField("List", display + "\nfiller")
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
    aliases: ["cboards, leaders"],
    permLevel: "User"
};

exports.help = {
    name: "leaderboards",
    category: "Economy",
    description: "Displays the top 25 in coin earning!",
    usage: "leaderboards"
};
