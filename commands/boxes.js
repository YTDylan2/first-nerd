// Boxes command

const discord = require('discord.js')


exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  var config = client.config
  var boxData = config.boxData

  let request = args[0]
  let done = false;

  if (!request) {
    var embed = new discord.RichEmbed()
    embed.setTitle("Available Boxes")
    embed.setDescription("A list of all available boxes to open.\nUse `>boxes [box name]` for specific box information.\nUse `>openbox [box name]` to open a box!")
    embed.setColor(process.env.green)
    embed.setFooter(message.author.tag + " requested some boxes", message.author.avatarURL)
    embed.setTimestamp()
    for (box in boxData) {
      let data = boxData[box]
      let format = (client.responseEmojis[data.Emoji] || "") + ` - Price: $${data.Price.toLocaleString()}\n${data.Description}`
      embed.addField(`${box} Box`, format)
    }
    return message.channel.send({embed})
  } else {
    for (box in boxData) {
      if (box.toLowerCase() == request.toLowerCase()) {
        let data = boxData[box]
        let rarityFormat = []
        for (rarityName in data.Chances) {
          let chance = data.Chances[rarityName]
          rarityFormat.push(`${rarityName} - ${chance}%`)
        }
        rarityFormat = rarityFormat.join("\n") // DAB ARRAY LINEBREAKING

        var embed = new discord.RichEmbed()
        embed.setTitle(`${box} Box`)
        embed.setDescription(`${(client.responseEmojis[data.Emoji] || "")} ${data.Description}`)
        embed.addField("Price", `$${data.Price}`)
        embed.addField("Box Chances", rarityFormat)
        embed.setColor(process.env.green)
        embed.setFooter(message.author.tag + " requested box info on " + `${box} Box`, message.author.avatarURL)
        embed.setTimestamp()
        done = true
        return message.channel.send({embed})
      }

    }
    if (!done) {
      message.channel.send("I couldn't find the box you were looking for. Please make sure you spell it correctly!")
    }
  }


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["boxlist"],
  permLevel: "User"
};

exports.help = {
  name: "boxes",
  category: "Box Game Commands",
  description: "Views the boxes you can open.",
  usage: "boxes"
};
