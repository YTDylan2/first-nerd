// coin leaders

exports.run = (client, message, args, level) => {
   var sorted = [];
   const discord = require('discord.js')
   const ordinal = require('ordinal-js')
   let guildKey = message.guild.id + "-globalcoins"

   client.redisClient.get(guildKey, function(err, data) {
       if (data) {
         let parsed = JSON.parse(data)
         for (x in parsed) {
            sorted.push([x + '', parsed[x]])
         }
         sorted.sort(function(a, b) {
            return b[1] - a[1]
         })

         let display = ""
         for (i = 0; i < 10; i++) {
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
         .setTitle("Top 10 Server Users")
         .addField("List", display + "\nVanessa")
         .setColor(process.env.purple)

        message.channel.send({embed})
       } else {
          message.channel.send("Doesn't seem like anyone's here...")
       }
   })
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["leaders", "richest"],
    permLevel: "User"
};

exports.help = {
    name: "leaderboards",
    category: "Economy",
    description: "Displays the top 25 in coin earning!",
    usage: "leaderboards"
};
