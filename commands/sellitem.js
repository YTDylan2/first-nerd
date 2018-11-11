// View inventory

const moment = require("moment");
require("moment-duration-format");
const discord = require('discord.js')
const ordinal = require('ordinal-js')

var cooldowns = {
  /*
    "ID" : {
      "last": 90358002,
      "alerted": false
    }

  */

}

exports.run = async (client, message, [...sellData], level) => {
  var config = client.config
  var boxData = config.boxData

  let rawArgs = sellData.join(" ")
  let amount = sellData.shift()
  let args = sellData.join(" ")

  if (!parseInt(amount) && (amount !== "all" || amount !== "half")) {
    args = rawArgs
  }
  if (!args) {
    return message.reply("Please send an item name to sell! i.e. **>sellitem 3 ItemName**")
  }
  if (args.length < 5) {
    return message.reply("You need to describe an item in atleast 5 letters! Please be a bit more precise.")
  }

  let done = false
  let currentTime = Date.now()
  let thumbnail = "https://www.roblox.com/asset-thumbnail/image?width=420&height=420&format=png&assetId="

  if (!cooldowns[message.author.id]) {
    cooldowns[message.author.id] = {
      'last' : 0,
      'alerted' : false
    }
  }
  let cooldownData = cooldowns[message.author.id]

  if (currentTime - cooldownData.last < 5000) {
    if (!cooldownData.alerted) {
      cooldownData.alerted = true
      let timeElapsed = currentTime - cooldownData.last
      let format = moment.duration(5000 - timeElapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
      message.reply("You have to wait **" + format + "** until you can use this command again!");
    }
    return;
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
        let inventory = playerSave.inventory
        let itemsArray = client.jsonToArray(inventory)

        let item = itemsArray.find(i => i[1].name.toLowerCase().match(args.toLowerCase()))
        if (item) {
          if (amount == "all") {
            amount = item[1].amount
          }
          if (amount == "half") {
            amount = item[1].amount / 2
          }
          let sellAmount = parseInt(amount) || 1
          let itemAmount = item[1].amount
          let id = item[0]
          let deleting = false;
          if (isNaN(sellAmount)) {
            return message.reply("That doesn't seem like a number!")
          }
          if (sellAmount < 1) {
            return message.reply("Please send a number above 0!")
          }
          if (sellAmount > itemAmount) {
            return message.reply(`You don't have that many of the item! You can only sell up to **${itemAmount}** of that item!`)
          }
          if (itemAmount - sellAmount == 0) {
            deleting = true
          }
          if (itemAmount > 0) {
            let gain = item[1].value * sellAmount
            playerSave.inventory[id].amount = playerSave.inventory[id].amount - sellAmount
            if (deleting) {
              delete playerSave.inventory[id]
            }
            playerSave.coins = playerSave.coins + gain
            client.saveGuildData(message.guild, JSON.stringify(gData))

            var embed = new discord.RichEmbed()
            embed.setTitle("Item Sold")
            embed.setDescription(`You sold **${sellAmount.toLocaleString()}** of ${item[1].name} and gained: **${gain.toLocaleString()} coins**!`)
            embed.setColor(process.env.green)
            embed.setFooter(message.author.tag + " sold an item off", message.author.avatarURL)
            embed.setTimestamp()
            message.channel.send({embed})
          } else {

          }
        } else {
          return message.reply("I couldn't find that item in your inventory! Try running **>inventory** to view a list of your items.")
        }
      } else {
        return message.reply("You need a save for this! Please use the command **>begin** to start a save!")
      }
    }
  })


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "User"
};

exports.help = {
  name: "sellitem",
  category: "Box Game Commands",
  description: "Sells an item!",
  usage: "sellitem <optional amount> [name]"
};
