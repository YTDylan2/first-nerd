// Open box command

const moment = require("moment");
require("moment-duration-format");
const discord = require('discord.js')

var cooldowns = {
  /*
    "ID" : {
      "last": 90358002,
      "alerted": false
    }

  */

}

function checkMacro(client, message) {
  let commands = client.commandLogs[message.author.id]
  let count = 0;
  for (x in commands) {
    if (commands[x] == 'openbox') {
      count = count + 1
    }
    if (count >= 350) {
      return true
    }
  }
  return false
}

exports.run = async (client, message, args, level) => {
  var config = client.config
  var boxData = config.boxData

  let request = args[0]
  let done = false
  let currentTime = Date.now()
  if (!cooldowns[message.author.id]) {
    cooldowns[message.author.id] = {
      'last' : 0,
      'alerted' : false
    }
  }
  let cooldownData = cooldowns[message.author.id]
  let macroing = checkMacro(client, message)
  if (macroing) {
    return message.reply("Sorry, you can only run this command 350 times every hour.")
  }

  if (request) {
    request = request.toProperCase()
    for (box in boxData) {
      if (box == request) {
        if (done) return;
        done = true
        if (currentTime - cooldownData.last < 7000) {
          if (!cooldownData.alerted) {
            cooldownData.alerted = true
            let timeElapsed = currentTime - cooldownData.last
            let format = moment.duration(7000 - timeElapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
            message.reply("You have to wait **" + format + "** until you can open a box! (7 second cooldown!)");
          }
          return;
        }
        setTimeout(() => {
          cooldownData.alerted = false
        }, 7000)
        cooldownData.last = currentTime
        client.getGuildData(message.guild).then(reply => {
          if (reply) {
            let gData = JSON.parse(reply)
            let playerData = gData.playerData.players
            if (playerData[message.author.id]) {
              let playerSave = playerData[message.author.id]
              let multiplier = 1

              let voteCheck = client.checkBonus(message, playerSave)
              if (!voteCheck[0]) {
                if (voteCheck[1]) {
                  let weekend = client.botlistclient.isWeekend()
                  if (weekend) {
                    multiplier = 3
                  } else {
                    multiplier = 2
                  }
                }
              }

              let data = boxData[request]
              let price = data.Price * multiplier
              let coins = playerSave.coins
              if (coins < (price  * multiplier)) {
                let difference = (price * multiplier) - coins
                return message.reply("Oops! Looks like you need " + difference + " more coins to crack this one open.")
              }
              playerSave.coins = playerSave.coins - (price * multiplier)
              let winner = client.pickBoxItem(request)

              let item = winner[0]
              let rarity = winner[1]
              let thumbnail = "https://www.roblox.com/asset-thumbnail/image?width=420&height=420&format=png&assetId="
              if (item == 'not found') {
                return message.reply("An error occurred with opening the box! Error description: `Box does not exist`")
              }
              if (item == 'items error') {
                return message.reply("An error occurred with opening the box! Error description: `Items are empty`")
              }
              let stats = [
                `Rarity: ${rarity}`,
                `Price: ${ (item.price * multiplier).toLocaleString()}`,
                `Value: ${ (item.value * multiplier).toLocaleString()}`,
              ]

              stats = stats.join("\n")

              let inventory = playerSave.inventory
              if (inventory) {
                if (inventory[item.assetId]) {
                  inventory[item.assetId].amount = inventory[item.assetId].amount + (1 * multiplier)
                } else {
                  inventory[item.assetId] = {
                    assetId: item.assetId,
                    name: item.name,
                    price: item.price,
                    value: item.value,
                    amount: 1 * multiplier
                  }
                }
              }

              var embed = new discord.RichEmbed()
              embed.setTitle("Box Opened")
              embed.setDescription(`${(client.responseEmojis[data.Emoji] || "")} You opened a ${request} Box and got: **(x${multiplier}) ${item.name}**!\nUse **>inventory** to view your items!\nUse **>boxstats** to view your stats!\nDon't want this item? You can use **>sellitem** to sell it!`)
              embed.addField("Stats", stats)
              embed.setThumbnail(thumbnail + item.assetId)
              embed.setColor(process.env.green)
              embed.setFooter(message.author.tag + " cracked a box open", message.author.avatarURL)
              embed.setTimestamp()

              client.saveGuildData(message.guild, JSON.stringify(gData))
              return message.channel.send({embed})
            } else {
              return message.reply("You don't have a save! Please run the command **>begin** to start your save!")
            }
          }
        })

      }
    }
  } else {
    return message.reply("Don't know which box to open? Use **>boxes** for a list of boxes!")
  }
  if (!done) {
    return message.reply("I couldn't find that box! Use **>boxes** for a list of boxes!")
  }


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["spinbox", "opencase"],
  permLevel: "User"
};

exports.help = {
  name: "openbox",
  category: "Box Game Commands",
  description: "Opens a box!",
  usage: "openbox [box name]"
};
