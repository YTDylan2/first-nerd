// coin leaders

exports.run = (client, message, args, level) => {
   var sorted = [];
   var discord = require('discord.js')
   
   client.redisClient.get("Global Coins", function(err, data) {
      if (data) {
        for (x in data) {
          sorted.push([x, data[x]])
        }
        sorted.sort(function(a, b) {
          return a > b
        })
        
        let display = []
        for (i = 0; i < 25; i++) {
          var userTable = sorted[i]
          if (userTable) {
            let member = client.users.get(userTable[0])
            if (member) {
              display.push(i + ". **" + member.tag + "** - **" userTable[1] + "** coins\n")
            }
          }
        }
        let str = display.join(" ")
        const embed = new discord.RichEmbed()
        .setTitle("Top 25 Global Users")
        .addField("List", str)
        .setColor(6579455)
        
        message.channel.send({embed})
      } else {
        message.channel.send("nobody on the leaderboards yet")
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
