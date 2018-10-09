
// dailies

exports.run = (client, message, args, level) => {
    const moment = require("moment");
    require("moment-duration-format");

    let guild = message.guild
    let channel = message.channel
    let user = message.author

    let time = Date.now()
    let oneDay = 86400000

    client.getGuildData(guild).then(response => {
      let data = JSON.parse(response)
      if (data) {
          let playerData = data.economy.players[user.id]
          let lastClaim = parseInt(reply)
          let timeElapsed = time - lastClaim
          if (timeElapsed >= oneDay) {
            let daily = parseInt(data.settings.workEarnDaily) || client.config.defaultSettings.settings.workEarnDaily
            playerData.coins = playerData.coins + daily

            client.setData(guild.id + '-DATA', JSON.stringify(data))
            client.updateGlobal(guild.id)
          } else {
            let format = moment.duration(oneDay - timeElapsed).format(" D [days], H [hours], m [minutes], s [seconds]");
            channel.send("You have to wait **" + format + "** until you can claim your daily coins!")
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
    category: "Economy",
    description: "Receive your daily coins!",
    usage: "daily"
};
