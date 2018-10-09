// workin
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
    "You swept the floors and got ",
    "You dusted the ceiling ",
    "You made a successful game and got ",
    "You did some work and got ",
    "You helped someone find their cat and they rewarded you with ",
    "You sold your old junk and made ",
    "You wrote a song, and sold tons of copies for ",
    "You sold your business for "
  ]
  let user = message.author
  let timeoutKey = user.id + "-" + guild.id + '-timeout'

  let now = Date.now()

  client.getGuildData(guild).then(response => {
    let data = JSON.parse(response)
    if (data) {
      let settings = data.settings
      let economy = data.economy

      let workEarnMin = parseInt(settings.workEarnMin) || client.config.defaultSettings.settings.workEarnMin || 20
      let workEarnMax = parseInt(settings.workEarnMax) || client.config.defaultSettings.settings.workEarnMax || 50
      let workEarnCooldown = parseInt(settings.workEarnCooldown) || client.config.defaultSettings.settings.workEarnCooldown || 5

      let playerData = economy.players[user.id]

      workEarnCooldown = workEarnCooldown * 1000
      if (!workers[timeoutKey]) {
        workers[timeoutKey] = now - (workEarnCooldown * 2)
      }
      if (workers[timeoutKey]) {
      let time = workers[timeoutKey]
        if (now - time > workEarnCooldown) {
          workers[timeoutKey] = now
          let phrase = random(phrases)
          let payout = getRand(workEarnMin, workEarnMax)
          let embed = new discord.RichEmbed()
          embed.setTitle("Job")
          embed.setDescription(phrase + payout + " coins.")
          embed.setColor(process.env.green)
          if (payout >= Math.pow(2^40)) {
              message.channel.send("Could not payout; sum is too great!")
              return
          }
          playerData.coins = playerData.coins + payout
          client.set(guild.id + '-DATA', JSON.stringify(data))
          client.updateGlobal(guild.id)
        } else {
          let timeElapsed = now - time
          let format = moment.duration(workEarnCooldown - timeElapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
          message.channel.send("You have to wait **" + format + "** until you can work!");
        }
      }
    }
  })
}

exports.conf = {
		enabled: true,
		guildOnly: true,
		aliases: ["work"],
		permLevel: "User"
};

exports.help = {
		name: "job",
		category: "Economy",
		description: "Put in some time and get some coins!",
		usage: "job"
};
