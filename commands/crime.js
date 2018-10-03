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
  client.redisClient.get(guild.id + '-SETTINGS', function(err, reply) {
    let settings = JSON.parse(reply)
    if (!settings) {
      settings = client.config.defaultSettings
    }

    let workEarnMin = parseInt(settings.workEarnMin) || client.config.defaultSettings.workEarnMin || 20
    let workEarnMax = parseInt(settings.workEarnMax) || client.config.defaultSettings.workEarnMax || 50
    let workEarnCooldown = parseInt(settings.workEarnCooldown) || client.config.defaultSettings.workEarnCooldown || 5
    let crimeMultiplier = parseInt(settings.crimeMultiplier) || client.config.defaultSettings.crimeMultiplier || 1.5
    let crimeDeductionPercent = parseInt(settings.crimeDeductionPercent) || client.config.defaultSettings.crimeDeductionPercent || 2.5
    let crimeWinRate = parseInt(settings.crimeWinRate) || client.config.defaultSettings.crimeWinRate || 50

    workEarnCooldown = workEarnCooldown * 1000
    if (!workers[timeoutKey]) {
      workers[timeoutKey] = now - (workEarnCooldown * 2)
    }

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
          client.redisClient.incrby(dataKey, payout, function(err, reply) {
            message.channel.send({embed})

          client.updateGlobal({key: message.author.id, value: reply, guild: message.guild.id + "-globalcoins"})
          })
        } else {
          workers[timeoutKey] = now
          let phrase = random(losePhrases)
          client.redisClient.get(dataKey, function(err, coins) {
            let embed = new discord.RichEmbed()
            let loss = Math.floor(coins * (crimeDeductionPercent / 100))
            embed.setTitle("Loss")
            embed.setDescription(phrase + loss + " coins!")
            embed.setColor(process.env.red)
            client.redisClient.decrby(dataKey, loss, function(err, reply) {
              message.channel.send({embed})
              client.updateGlobal({key: message.author.id, value:reply, guild: message.guild.id + "-globalcoins"})
            })

          })

        }
      } else {
        let timeElapsed = now - time
        let format = moment.duration(workEarnCooldown - timeElapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
        message.channel.send("You have to wait **" + format + "** until you can use this command!");
      }
    } else {
      workers[timeoutKey] = now - workEarnCooldown
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
