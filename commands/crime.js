// oooh he stealin
var workers = {}

const moment = require("moment");
require("moment-duration-format");

const discord = require('discord.js')

function random(array) {
    return array[Math.floor(Math.random() * array.length)] || array[0]
}

function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

exports.run = (client, message, args, level) => {
  let guild = message.guild
  let phrases = [
    "You stole a watch and sold it for ",
    "You robbed the bank and made ",
    "You stole someone's shoes and sold them for ",
    "You hacked the Bitcoin network and profited ",
    "You sold illegal products for ",
    "You hacked a ROBLOX account and sold it for ",
  ]
  let losePhrases = [
    "You tried to rob the bank but got fined for ",
    "You got beat up by your local bully and he took ",
    "You gave up your lunch money, which was ",
    "You miserably failed while trying to make profit off stolen goods, resulting in a loss of ",
    "Your coins fell down a sewer hole, and you lost ",
    "You got scammed by your closest friend for "
  ]

  let timeoutKey = message.author.id + "-" + message.guild.id + '-timeout'
  let dataKey = message.author.id + "-" + message.guild.id + "-coins"

  let now = Date.now()
  client.getGuildData().then(response => {
    let data = JSON.parse(response)
    if (data) {
      let settings = data.settings
      let economy = data.economy

      let workEarnMin = parseInt(settings.workEarnMin) || client.config.defaultSettings.settings.workEarnMin || 20
      let workEarnMax = parseInt(settings.workEarnMax) || client.config.defaultSettings.settings.workEarnMax || 50
      let workEarnCooldown = parseInt(settings.workEarnCooldown) || client.config.defaultSettings.settings.workEarnCooldown || 5
      let crimeMultiplier = parseInt(settings.crimeMultiplier) || client.config.defaultSettings.settings.crimeMultiplier || 1.5
      let crimeDeductionPercent = parseInt(settings.crimeDeductionPercent) || client.config.defaultSettings.settings.crimeDeductionPercent || 2.5
      let crimeWinRate = parseInt(settings.crimeWinRate) || client.config.defaultSettings.settings.crimeWinRate || 50

      workEarnCooldown = workEarnCooldown * 1000
      if (!workers[timeoutKey]) {
        workers[timeoutKey] = now - (workEarnCooldown * 2)
      }

      let playerData = economy.players[user.id]

      if (workers[timeoutKey]) {
        let time = workers[timeoutKey]
        if (now - time > workEarnCooldown) {
          let crimeChance = getRand(1, 100)
          if (crimeChance <= crimeWinRate) {
            workers[timeoutKey] = now
            let phrase = random(phrases)
            let payout = getRand(workEarnMin, workEarnMax)
            let embed = new discord.RichEmbed()
            payout = Math.floor(payout * crimeMultiplier)
            embed.setTitle("Crime")
            embed.setDescription(phrase + payout + " coins!")
            embed.setColor(process.env.green)
            playerData.coins = playerData.coins + payout
            client.set(guild.id + '-DATA', JSON.stringify(data))
            client.updateGlobal(guild.id)

          } else {
            workers[timeoutKey] = now
            let phrase = random(losePhrases)
            let embed = new discord.RichEmbed()
            let loss = Math.floor(playerData.coins * (crimeDeductionPercent / 100))
            embed.setTitle("Loss")
            embed.setDescription(phrase + loss + " coins!")
            embed.setColor(process.env.red)
            playerData.coins = playerData.coins - loss
            client.set(guild.id + '-DATA', JSON.stringify(data))
            client.updateGlobal(guild.id)
          }
       } else {
         let timeElapsed = now - time
         let format = moment.duration(workEarnCooldown - timeElapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
         message.channel.send("You have to wait **" + format + "** until you can use this command!");
       }
     } else {
       workers[timeoutKey] = now - workEarnCooldown
     }
    }
  })
}

exports.conf = {
		enabled: true,
		guildOnly: true,
		aliases: ["steal"],
		permLevel: "User"
};

exports.help = {
		name: "crime",
		category: "Economy",
		description: "Do some dirty work at a chance of getting a higher payout.",
		usage: "crime"
};
