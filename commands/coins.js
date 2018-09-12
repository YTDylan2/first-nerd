// coinz

exports.run = (client, message, args, level) => {
    let user = message.mentions.members.first();
    
    if (user) {
      let id = user.id
      let member = client.users.get(id)
      client.redisClient.get(id + '-coins', function(err, data) {
        if (data) {
          message.channel.send(`**${member.username}** has **${data}** coins.`)
        } else {
          message.channel.send("that person broke, no money")
        }
      })
     } else {
        let id = message.author.id
        let member = client.users.get(id)
        client.redisClient.get(id + '-coins', function(err, data) {
          if (data) {
            message.channel.send(`you have **${data}** coins.`)
          } else {
            message.channel.send("ur broke")
          }
        })
      }
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["bal"],
    permLevel: "User"
};

exports.help = {
    name: "coins",
    category: "Economy",
    description: "Returns amount of coins that [user] has, or your coins if none specified.",
    usage: "coins [user]"
};
