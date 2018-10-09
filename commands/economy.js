// economy control
const discord = require('discord.js')

exports.run = async (client, message, args, level) => {

    let guild = message.guild
    let user = message.mentions.members.first()

    let action = args[0]
    let target = args[1]
    let value = args[2]
    if (action == 'help' || !action) {
      let embed = new discord.RichEmbed()
      embed.setTitle("Economy Control")
      embed.setDescription("These commands will help you control your economy.\nTo set values such as coin earning, please use `settings view`")

      embed.addField('give', "Gives a user or all users coins.\n`economy give @CoolDude 1000`\neconomy give all 10000")
      embed.addField('reset', "Resets a user or all user coins.\n`economy reset @FreakingAnnoying`\neconomy reset all")
      embed.addField('allcoins', "Returns the number of coins in circulation in the server.")
      embed.setTimestamp()
      embed.setFooter('morbify is ogly >:)', client.user.avatarURL)
      embed.setColor(process.env.green)
      message.channel.send({embed})
    }
    client.getGuildData(guild).then(response => {
      let guildData = JSON.parse(response)

      if (guildData) {
        if (action == 'reset') {
          if (target == 'all') {
            let members = guild.members
            for (member in members.array()) {
              guildData.economy.players[members.array()[member].id].coins = 0
            }
            guildData.economy.leaderboards = {}
            client.setData(guild.id + '-DATA', JSON.stringify(guildData))
            message.channel.send("Reset " + members.array().length + " users.")
            return
          }
          if (user) {
            guildData.economy.players[user.id].coins = 0
            client.setData(guild.id + '-DATA', JSON.stringify(guildData))
            message.channel.send("Reset " + user.user.tag + "'s coins.")
          } else {
            return message.channel.send("Please send a user, or do `all` to reset all members.")
          }
        }
        if (action == 'give') {
          if (target == 'all') {
            if (parseInt(value)) {
              let members = guild.members
              if (value >= Math.pow(2, 40)) {
                  message.channel.send("The number is too large!")
                  return
              }
              for (member in members.array()) {
                guildData.economy.players[members.array()[member].id].coins = guildData.economy.players[members.array()[member].id].coins + value
              }
              client.setData(guild.id + '-DATA', JSON.stringify(guildData))
              message.channel.send("Sucessfully gave all members `" + value + "` coins.")
            } else {
              return message.channel.send("Please send a number!")
            }
            return
          }
          if (user) {
            guildData.economy.players[user.id].coins = guildData.economy.players[user.id].coins + value
            client.setData(guild.id + '-DATA', JSON.stringify(guildData))
          } else {
            return message.channel.send("Please send a user, or do `all` to give coins all members.")
          }
        }
      }
    })



}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [""],
    permLevel: "Administrator"
};

exports.help = {
    name: "economy",
    category: "Economy",
    description: "Control the economy in your server!",
    usage: "economy help"
};
