// Leaders
const discord = require('discord.js')
const ordinal = require('ordinal-js')

exports.run = (client, message, args, level) => {
  client.getGuildData(message.guild).then(reply => {
    if (reply) {
      let gData = JSON.parse(reply)
      let playerData = gData.playerData.players
      let playersArray = client.jsonToArray(playerData)
      let leadersData = []

      if (playersArray.length == 0) {
        return message.reply("Doesn't seem like anyone is on the leaderboards. Want to be the first? Use **>begin**!")
      }
      // Looks like
      /*
          [
            {
            "ID": {stats etc}
          }
        ]
      */
      let request = args[0]
      let requestedPage = args[1]
      if (!request || request == "price") {
        playersArray.sort( (a, b) => {
          let aPriceTotal = 0
          let bPriceTotal = 0

          for (y in a[1].inventory) {
            let item = a[1].inventory[y]
            let amount = item.amount
            aPriceTotal = aPriceTotal + (amount * item.price)
          }

          for (z in b[1].inventory) {
            let item = b[1].inventory[z]
            let amount = item.amount
            bPriceTotal = bPriceTotal + (amount * item.price)
          }
          return bPriceTotal - aPriceTotal
        })
        if (requestedPage) {
          if (parseInt(requestedPage)) {
            requestedPage = parseInt(requestedPage) - 1
          }
        } else {
          requestedPage = 0
        }
        if (requestedPage <= -1) {
          return message.reply("Page number needs to above 0!")
        }

        let page = 0
        for (x in playersArray) {
          if (x % 9 == 0 && x > 0) {
            page = page + 1
          }
          if (!leadersData[page]) {
            leadersData[page] = []
          }

          let priceTotal = 0
          let inventory = playersArray[x][1].inventory
          for (n in inventory) {
            let item = inventory[n]
            let amount = item.amount
            priceTotal = priceTotal + (amount * item.price)
          }
          let user = client.users.get(playersArray[x][0])
          if (user) {
            leadersData[page].push(`${user.tag} | **$${priceTotal.toLocaleString()}**`)
          } else {
            leadersData[page].push(`An unknown user | **$${priceTotal.toLocaleString()}**`)
          }
        }
        if (!leadersData[requestedPage]) {
          return message.reply("That page on the leaderboards does not exist!")
        }

        let realPages = parseInt(page) + 1
        var embed = new discord.RichEmbed()
        embed.setTitle(message.guild.name + "'s Richest Collectors")
        embed.setDescription(`The richest of the rich! This is page ${parseInt(requestedPage) + 1}/${realPages}.`)
        embed.addField("Players", leadersData[requestedPage].join("\n"))
        embed.setColor(process.env.green)
        if (request) {
          embed.addField("Tags", "**price** - Displays the richest in total price!")
        }
        embed.setFooter(message.author.tag + " looking for the rich ones", message.author.avatarURL)
        embed.setTimestamp()
        return message.channel.send({embed})
      }
      if (request == "value") {
        playersArray.sort( (a, b) => {
          let aValueTotal = 0
          let bValueTotal = 0

          for (y in a[1].inventory) {
            let item = a[1].inventory[y]
            let amount = item.amount
            aValueTotal = aValueTotal + (amount * item.price)
          }

          for (z in b[1].inventory) {
            let item = b[1].inventory[z]
            let amount = item.amount
            bValueTotal = bValueTotal + (amount * item.price)
          }
          return bValueTotal - aValueTotal
        })
        if (requestedPage) {
          if (parseInt(requestedPage)) {
            requestedPage = parseInt(requestedPage) - 1
          }
        } else {
          requestedPage = 0
        }
        if (requestedPage <= -1) {
          return message.reply("Page number needs to above 0!")
        }

        let page = 0
        for (x in playersArray) {
          if (x % 9 == 0 && x > 0) {
            page = page + 1
          }
          if (!leadersData[page]) {
            leadersData[page] = []
          }

          let valueTotal = 0
          let inventory = playersArray[x][1].inventory
          for (n in inventory) {
            let item = inventory[n]
            let amount = item.amount
            valueTotal = valueTotal + (amount * item.value)
          }
          let user = client.users.get(playersArray[x][0])
          if (user) {
            leadersData[page].push(`${user.tag} | **${valueTotal.toLocaleString()} value**`)
          } else {
            leadersData[page].push(`An unknown user | **${valueTotal.toLocaleString()} value**`)
          }
        }
        if (!leadersData[requestedPage]) {
          return message.reply("That page on the leaderboards does not exist!")
        }

        let realPages = parseInt(page) + 1
        var embed = new discord.RichEmbed()
        embed.setTitle(message.guild.name + "'s Richest Collectors")
        embed.setDescription(`The richest of the rich! This is page ${parseInt(requestedPage) + 1}/${realPages}.`)
        embed.addField("Players", leadersData[requestedPage].join("\n"))
        embed.setColor(process.env.green)
        embed.addField("Tags", "**value** - Displays the richest in value!")
        embed.setFooter(message.author.tag + " looking for the rich ones", message.author.avatarURL)
        embed.setTimestamp()
        return message.channel.send({embed})
      }
    }
  })
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["leaders", "richest", "lb", "leaderboard"],
    permLevel: "User",
    subCommands: [
      "value - Gets the leaders sorted by top value in the server.",
      "price - Gets the leaders sorted by top price in the server."
    ]
};

exports.help = {
    name: "leaderboards",
    category: "WIP Commands",
    description: "Gets the top leaders in the server!",
    usage: "leaderboards [option] [page #]"
};
