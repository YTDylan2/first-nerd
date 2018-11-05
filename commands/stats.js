const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");
  var discord = require("discord.js")

  const embed = new discord.RichEmbed()
  .setAuthor("Vanessa", client.user.avatarURL)
  .setTitle("Bot Statistics")
  .setDescription("Some collected statistics for Vanessa!")
  .addField("Memory Usage", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB")
  .addField("Uptime", duration)
  .addField("Users", client.users.size.toLocaleString())
  .addField("Servers", client.guilds.size.toLocaleString())
  .addField("Channels", client.channels.size.toLocaleString())
  .addField("Discord.js Version", "v" + version)
  .addField("Node Version", process.version)
  .addField("Build Version", process.env.HEROKU_RELEASE_VERSION)
  .setTimestamp()
  .setColor(process.env.blue)
  message.channel.send({embed})
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Misc",
  description: "Gives some useful bot statistics",
  usage: "stats"
};
