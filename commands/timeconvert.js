function returnMultiplier(letter) {
  let times = {
    "ms": 0.001,
    "s" : 1,
    "m" : 60,
    "h" : 3600,
    "d" : 86400
  }
  return times[letter]
}

exports.run = (client, message, args, level) => {
    const moment = require('moment')
    require('moment-duration-format')
    let time = args[0]
    let number = parseFloat(time.match(/[\d\.]+/))
    let r = time.replace(/[^a-zA-Z]+/g, '');
    let multiplier = returnMultiplier(r)
    if (number && multiplier) {
      let format = moment.duration(number * multiplier, "seconds").format({
        template: ('y [years], M [months], w [weeks], D [days], H [hours], m [minutes], s [seconds]'),
        precision: 2
      })
      message.channel.send("Time: **" + format + "**")
    } else {
      if (!number) {
        return message.channel.send("I need a number!")
      }
      if (!multiplier) {
        return message.channel.send("Please send a valid time format! i.e `1s`, `4d`, `675ms`")
      }
    }

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["ctime", "timeconv", "time"],
    permLevel: "User"
};

exports.help = {
    name: "timeconvert",
    category: "Fun",
    description: "Convert time. Say `1s`, `1m`, `1h`, `1d`",
    usage: "timeconvert [time]"
};
