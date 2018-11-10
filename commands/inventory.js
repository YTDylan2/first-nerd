// View inventory

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

exports.run = async (client, message, args, level) => {
  var config = client.config
  var boxData = config.boxData

  let request = args[0]
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
        if (request) {
          if (parseInt(request)) { // Assume they are looking for a page

            // Get items by PAGE
            let inventory = playerSave.inventory
            let itemArray = client.jsonToArray(inventory)
            let itemData = []
            if (itemArray.length == 0) {
              return message.reply("You don't have any items! Try opening a box with **>openbox**!")
            }
            itemArray.sort( (a, b) => {
              return b[1].amount - a[1].amount
            })

            let pages = itemArray.length / 10 // adding soon; only 4 items as of writing
            let page = 0
            let playerChosenPage = parseInt(request) - 1
            if (playerChosenPage < 0) {
              return message.reply("Page number needs to above 0!")
            }
            for (x in itemArray) {
              if (x % 9 == 0 && x > 0) {
                page = page + 1
              }
              if (!itemData[page]) {
                itemData[page] = []
              }

              let item = itemArray[x]
              let amount = item[1].amount
              let name = item[1].name
              let value = item[1].value
              let price = item[1].price
              itemData[page].push(`${name} | Owned: ${amount.toLocaleString()} | $${price.toLocaleString()} | ${value.toLocaleString()} value`)
            }
            if (!itemData[playerChosenPage]) {
              message.reply("You don't have that many pages of items!")
            }
            let realPages = parseInt(page) + 1
            var embed = new discord.RichEmbed()
            embed.setAuthor(message.author.tag + "'s Inventory", message.author.displayAvatarURL)
            embed.setDescription(`All your inventory items! This is page ${playerChosenPage + 1}/${realPages}.`)
            embed.addField("Items", itemData[playerChosenPage || 0].join("\n"))
            embed.setColor(process.env.green)
            embed.setFooter(message.author.tag + " lookin' at their items", message.author.avatarURL)
            embed.setTimestamp()
            return message.channel.send({embed})
          } else { // Assume they are looking for an item name

            // Look for item by NAME
            let inventory = playerSave.inventory
            let itemArray = client.jsonToArray(inventory)
            if (itemArray.length == 0) {
              return message.reply("You don't have any items! Try opening a box with **>openbox**!")
            }

            let chosenItem = itemArray.find(item => item[1].name.toLowerCase().match(request.join(" ").toLowerCase()))
            if (chosenItem) {
              let id = chosenItem[0]
              let name = chosenItem[1].name
              let amount = chosenItem[1].amount
              let price = chosenItem[1].price
              let value = chosenItem[1].value

              let priceTotal = 0
              let valueTotal = 0

              for (x in inventory) {
                let item = inventory[x]
                let amount = item.amount
                priceTotal = priceTotal + (amount * item.price)
                valueTotal = valueTotal + (amount * item.value)
              }

              let pricePercentage = ((price * amount) / priceTotal) * 100
              let valuePercentage = ((value * amount) / valueTotal) * 100
              pricePercentage = pricePercentage.toFixed(2) + '%'
              valuePercentage = valuePercentage.toFixed(2) + '%'

              var embed = new discord.RichEmbed()
              embed.setAuthor(message.author.tag + "'s " + name, message.author.displayAvatarURL)
              embed.setDescription(`Info on your ${name} collection!\n\nYou have $${priceTotal.toLocaleString()} and ${valueTotal.toLocaleString()} value in total with this item.\nThat makes it **${pricePercentage}** of your total price and **${valuePercentage}** of your total value.`)
              embed.addField("Amount", amount.toLocaleString(), true)
              embed.addField("Price of 1 " + name, '$' + price.toLocaleString())
              embed.addField("Value of 1 " + name, value.toLocaleString() + ' value')
              embed.setThumbnail(thumbnail + id)
              embed.setColor(process.env.green)
              embed.setFooter(message.author.tag + " lookin' at their items", message.author.avatarURL)
              embed.setTimestamp()
              return message.channel.send({embed})
            } else {
              return message.reply(`I couldn't find a **'${request}'** in your inventory. Did you check your spelling?`)
            }
          }
        } else { // No arguments given?
          // Display page ONE

          let inventory = playerSave.inventory
          let itemArray = client.jsonToArray(inventory)
          let itemData = []

          if (itemArray.length == 0) {
            return message.reply("You don't have any items! Try opening a box with **>openbox**!")
          }
          itemArray.sort( (a, b) => {
            return b[1].amount - a[1].amount
          })


          let pages = itemArray.length / 10 // adding soon; only 4 items as of writing
          let page = 0
          for (x in itemArray) {
            if (x % 9 == 0 && x > 0) {
              page = page + 1
            }
            if (!itemData[page]) {
              itemData[page] = []
            }

            let item = itemArray[x]
            let amount = item[1].amount
            let name = item[1].name
            let price = item[1].price
            let value = item[1].value
            itemData[page].push(`${name} | Owned: ${amount.toLocaleString()} | $${price.toLocaleString()} | ${value.toLocaleString()} value`)
          }

          let realPages = parseInt(page) + 1

          var embed = new discord.RichEmbed()
          embed.setAuthor(message.author.tag + "'s Inventory", message.author.displayAvatarURL)
          embed.setDescription(`All your inventory items! This is page 1/${realPages}.`)
          embed.addField("Items", itemData[0].join("\n"))
          embed.setColor(process.env.green)
          embed.setFooter(message.author.tag + " lookin' at their items", message.author.avatarURL)
          embed.setTimestamp()
          return message.channel.send({embed})
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
  name: "inventory",
  category: "WIP Commands",
  description: "Opens a box!",
  usage: "inventory <opt. item name OR page #>"
};
