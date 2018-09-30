
// dailies

exports.run = (client, message, args, level) => {
    const moment = require("moment");
    require("moment-duration-format");

    let guild = message.guild
    let channel = message.channel
    let user = message.author
    let playerCoinKey = user.id + '-' + guild.id + '-coins'
    let playerDailyKey = user.id + '-' + guild.id + '-daily'

    let time = Date.now()
    let oneDay = 86400000
    client.redisClient.get(guild.id + '-SETTINGS', function(err, response) {
      let settings = JSON.parse(reponse)
      if (!settings) {
        settings = client.config.defaultSettings
      }
      client.redisClient.get(playerDailyKey, function(err, reply) {
        if (reply) {
          let lastClaim = parseInt(reply)
          let timeElapsed = time - lastClaim
          if (timeElapsed >= oneDay) {
            let daily = parseInt(settings.coinEarnDaily) || client.config.defaultSettings.coinEarnDaily
            client.redisClient.incrby(playerCoinKey, daily, function(err, newCoins) {
              if (newCoins) {
                channel.send("You just received your daily **" + daily + "** coins!")
              }
            })
            client.redisClient.set(playerDailyKey, time)
          } else {
            let format = moment.duration(timeElapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
            channel.send("You have to wait **" + format + "** until you can claim your daily coins!")
          }
        } else {
          let daily = parseInt(settings.coinEarnDaily) || client.config.defaultSettings.coinEarnDaily
          client.redisClient.incrby(playerCoinKey, daily, function(err, newCoins) {
            if (newCoins) {
              channel.send("You just received your daily **" + daily + "** coins!")
            }
          })
          client.redisClient.set(playerDailyKey, time)
        }
      }
    })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["dailies"],
    permLevel: "User"
};

exports.help = {
    name: "daily",
    category: "Fun",
    description: "Receive your daily coins!",
    usage: "daily"
};
