// Boxes command

const discord = require('discord.js')


exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  var config = client.config
  var caseData = config.caseData

  let request = args[0]

  if (!request) {
    var embed = new discord.RichEmbed()
    embed.setTitle("Available Boxes")
    embed.setDescription("A list of all available boxes to open.")
    embed.setColor(process.env.green)
    embed.setFooter(message.author.tag + " requested some boxes", message.author.avatarURL)
    embed.setTimestamp()
    for (box in caseData) {
      let boxData = caseData[box]
      let format = (client.responseEmojis[boxData.Emoji] || "") + `- Price: $${boxData.Price.toLocaleString()}\n${boxData.Description}`
      embed.addField(`${box} Box`, format)
    }
    return message.channel.send({embed})
  } else {
    for (box in caseData) {
      if (box.toLowerCase() == request.toLowerCase()) {
        let boxData = caseData[box]
        let rarityFormat = []
        for (rarityName in boxData.Chances) {
          let chance = boxData.Chances[rarityName]
          rarityFormat.push(`${rarityName} - ${chance}%`)
        }
        rarityFormat = rarityFormat.join("\n") // DAB ARRAY LINEBREAKING

        var embed = new discord.RichEmbed()
        embed.setTitle(`${box} Box`)
        embed.setDescription(`${(client.responseEmojis[boxData.Emoji] || "")} ${boxData.Description}`)
        embed.addField("Price", `$${boxData.Price}`)
        embed.addField("Box Chances", rarityFormat)
        embed.setColor(process.env.green)
        embed.setFooter(message.author.tag + " requested box info on " + `${box} Box`, message.author.avatarURL)
        embed.setTimestamp()
        return message.channel.send({embed})
      }

    }
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "User"
};

exports.help = {
  name: "boxes",
  category: "WIP Commands",
  description: "Views the boxes you can open.",
  usage: "boxes"
};
