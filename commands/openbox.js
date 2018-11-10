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

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
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

  if (request) {

    for (box in boxData) {
      if (box.toLowerCase() == request.toLowerCase()) {
        done = true
        if (currentTime - cooldownData.last < 5000) {
          if (!cooldownData.alerted) {
            cooldownData.alerted = true
            let timeElapsed = currentTime - cooldownData.last
            let format = moment.duration(5000 - timeElapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
            message.channel.send("You have to wait **" + format + "** until you can open a box!");
            return;
          }

        }
        setTimeout(() => {
          cooldownData.alerted = false
        }, 5000)
        cooldownData.last = currentTime
        client.getGuildData(message.guild).then(reply => {
          if (reply) {
            let gData = JSON.parse(reply)
            let playerData = gData.playerData.players
            if (playerData[message.author.id]) {
              let playerSave = playerData[message.author.id]

              let data = boxData[box]
              let price = data.Price
              let coins = playerData.coins
              if (coins < price) {
                let difference = price - coins
                return message.channel.send("Oops! Looks like you need " + difference + " more coins to crack this one open.")
              }
              let winner = client.pickBoxItem(box)

              let item = winner[0]
              let rarity = winner[1]
              let thumbnail = "https://www.roblox.com/asset-thumbnail/image?width=420&height=420&format=png&assetId="
              if (item == 'not found') {
                return message.channel.send("An error occurred with opening the box! Error description: `Box does not exist`")
              }
              if (item == 'items error') {
                return message.channel.send("An error occurred with opening the box! Error description: `Items are empty`")
              }
              let stats = [
                `Rarity: ${rarity}`,
                `Price: ${item.price.toLocaleString()}`,
                `Value: ${item.value.toLocaleString()}`,
              ]

              stats = stats.join("\n")

              let inventory = playerSave.inventory
              if (inventory) {
                if (inventory[item.assetId]) {
                  inventory[item.assetId].amount = inventory[item.assetId].amount + 1
                } else {
                  inventory[item.assetId] = {
                    assetId: item.assetId,
                    name: item.name,
                    price: item.price,
                    value: item.value,
                    amount: 1
                  }
                }
              }
              var embed = new discord.RichEmbed()
              embed.setTitle("Box Opened")
              embed.setDescription(`${(client.responseEmojis[data.Emoji] || "")} You opened a ${box} Box and got a ${item.name}!`)
              embed.addField("Stats", stats)
              embed.setThumbnail(thumbnail + item.assetId)
              embed.setColor(process.env.green)
              embed.setFooter(message.author.tag + " cracked a box open", message.author.avatarURL)
              embed.setTimestamp()

              client.saveGuildData(message.guild, JSON.stringify(gData))
              return message.channel.send({embed})
            } else {
              return message.channel.send("You don't have a save! Please run the command **>begin** to start your save!")
            }
          }
        })

      }
    }
  } else {
    return message.channel.send("Don't know which box to open? Use **>boxes** for a list of boxes!")
  }
  if (!done) {
    return message.channel.send("I couldn't find that box! Use **>boxes** for a list of boxes!")
  }


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["spinbox"],
  permLevel: "User"
};

exports.help = {
  name: "openbox",
  category: "WIP Commands",
  description: "Opens a box!",
  usage: "open"
};
