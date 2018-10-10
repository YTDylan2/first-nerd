// coinz

exports.run = (client, message, args, level) => {
    let user = message.mentions.members.first();

    if (user) {
      let id = user.id
      let member = client.users.get(id)
      let dataKey = id + "-" + message.guild.id + "-coins"
      client.getGuildData().then(response => {
        let data = JSON.parse(response)
        if (data) {
          message.channel.send(`**${member.username}** has **${data.economy.players[member.id].coins || 0}** coins.`)
        } else {
          message.channel.send("They're a sad hobo sitting down on the road.")
        }
      })
     } else {
        let id = message.author.id
        let member = client.users.get(id)
        let dataKey = id + "-" + message.guild.id + "-coins"
        client.redisClient.get(dataKey, function(err, data) {
          if (data) {
            message.channel.send(`You have **${data.economy.players[member.id].coins || 0}** coins!`)
          } else {
            message.channel.send("You don't have enough money to use this command.\nWait, you have none.")
          }
        })
      }
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["bal", "money"],
    permLevel: "User"
};

exports.help = {
    name: "coins",
    category: "Economy",
    description: "Returns amount of coins that [user] has, or your coins if none specified.",
    usage: "coins [user]"
};
