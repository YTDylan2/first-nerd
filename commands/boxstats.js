// Add new data for users
const discord = require('discord.js')

exports.run = async (client, message, args, level) => {
    let guild = message.guild
    let member = message.mentions.members.first() || client.findGuildUser(message, args.join(" "))
    member = member.user || member

    client.getGuildData(guild).then(reply => {
      if (reply) {
        let gData = JSON.parse(reply)
        let serverData = gData.playerData.players
        if (serverData[member.id]) {
          let player = serverData[member.id]

          let coins = player.coins.toLocaleString()
          let shards = player.shards.toLocaleString()
          let votePoints = player.votePoints.toLocaleString()
          let level = player.level.toLocaleString()
          let xp = player.xp.toLocaleString()
          let sector = player.sector.toProperCase()
          let inventory = player.inventory

          let priceTotal = 0
          let valueTotal = 0

          for (x in inventory) {
            let item = inventory[x]
            let amount = item.amount
            priceTotal = priceTotal + (amount * item.price)
            valueTotal = valueTotal + (amount * item.value)
          }

          let stats = [
            `Total Item Worth: $${priceTotal.toLocaleString()}`,
            `Total Value: ${valueTotal.toLocaleString()} value\n`,
            `Coins: ${coins}`,
            `Shards: ${shards}`,
            `Voter Points: ${votePoints}`,
            `Level: ${level}`,
            `XP: ${xp}`,
            `Data Type: ${sector} Data`
          ]
          stats = stats.join('\n')

          let embed = new discord.RichEmbed()
          embed.setAuthor(member.tag + "'s Stats", member.avatarURL)
          embed.setColor(process.env.green)
          embed.setDescription(stats)
          embed.setFooter(message.author.tag + " lookin' for stats", message.author.avatarURL)
          embed.setTimestamp()
          message.channel.send({embed})

        } else {
          if (member.id == message.author.id) {
            return message.channel.send("You don't have a save! Please run `>begin` to make your save.")
          } else {
            return message.channel.send("The person you requested has no save. (" + member.tag + ")")
          }

        }
      } else {
        message.channel.send("It seems like your guild has no data. Auto updating...")
        client.updateGuilds().then(updated => {
          message.channel.send("Alright, done! Please run this command again.")
        })
        return;
      }
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["gamestats", "mystats"],
    permLevel: "User"
};

exports.help = {
    name: "boxstats",
    category: "Box Game Commands",
    description: "Check out your or another user's save stats.",
    usage: "boxstats [optional user]"
};
