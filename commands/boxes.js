// Boxes command

const discord = require('discord.js')


exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  var config = client.config
  var caseData = config.caseData

  var embed = new discord.RichEmbed()
  embed.setTitle("Available Boxes")
  embed.setDescription("A list of all available boxes to open.")
  embed.setColor(process.env.green)
  embed.setFooter(message.author.tag + " requested some boxes", message.author.avatarURL)
  embed.setTimestamp()
  for (box in caseData) {
    let boxData = caseData[box]
    let format = (client.responseEmojis[boxData.Emoji] || "") + `**Price: $${boxData.Price.toLocaleString()}**\n\n${boxData.Description}`
    embed.addField(`${box} Box`, format)
  }
  message.channel.send({embed})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "User"
};

exports.help = {
  name: "boxes",
  category: "System",
  description: "Views the boxes you can open.",
  usage: "boxes"
};
