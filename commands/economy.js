// economy control
const discord = require('discord.js')

exports.run = (client, message, args, level) => {

    let guild = message.guild
    let user = message.mentions.members.first()

    let action = args[0]
    let target = args[1]
    let value = args[2]
    if (action == 'help') {
      let embed = new discord.RichEmbed()
      embed.setTitle("Economy Control")
      embed.setDescription("These commands will help you control your economy.\nTo set values such as coin earning, please use `settings view`")

      embed.addTitle('give', "Gives a user or all users coins.\n`economy give @CoolDude 1000`\neconomy give all 10000")
      embed.addTitle('reset', "Resets a user or all user coins.\n`economy reset @FreakingAnnoying`\neconomy reset all")
      embed.addTitle('allcoins', "Returns the number of coins in circulation in the server.")
      embed.setTimestamp()
      embed.setFooter('morbify is ogly >:)')
      embed.setColor(process.env.green)
      message.channel.send({embed})
    }
    if (action == 'reset') {
      if (target == 'all') {
        let members = guild.members
        for (memberID in members) {
          client.redisClient.del(memberID + guild.id + '-coins')
        }
        client.redisClient.del(guild.id + "-globalcoins", function(err, reply) {
          message.channel.send("Successfully reset everyone!")
        })
        return
      }
      if (user) {
        client.redisClient.set(user.id + guild.id + '-coins', 0, function(err, reply) {
          message.channel.send("Successfully reset " + user.nickname + "'s coins.")
        })
      } else {
        return message.channel.send("Please send a user, or do `all` to reset all members.")
      }
    }
    if (action == 'give') {
      if (target == 'all') {
        if (parseInt(value)) {
          let members = guild.members
          for (memberID in members) {
            client.redisClient.incrby(memberID + guild.id + '-coins', value)
          }
          message.channel.send("Sucessfully gave all members `" + value + "` coins.")
        } else {
          return message.channel.send("Please send a number!")
        }
        return
      }
      if (user) {
        client.redisClient.incrby(user.id + guild.id + '-coins', value, function(err, reply) {
          message.channel.send("Sucessfully gave **" + user.nickname + "** `" + value + "` coins.")
        })
      } else {
        return message.channel.send("Please send a user, or do `all` to give coins all members.")
      }
    }

    if (action == 'allcoins') {
      let total = 0
      let members = guild.members
      for (memberID in members) {
        client.redisClient.get(memberID + guild.id + '-coins', function(err, coins) {
          if (coins) {
            total = total + coins
          }
        })
      }
      message.channel.send("There are `" + total + "` coins in circulation.")
    }


}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [""],
    permLevel: "Server Owner"
};

exports.help = {
    name: "economy",
    category: "Economy",
    description: "Control the economy in your server!",
    usage: "economy [action, (target all or user), value]"
};