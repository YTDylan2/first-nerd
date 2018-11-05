// clear messages
let badLinks = [
  "porn",
  "hentai",
  "deathaddict",
  "gay",
  "xvide",
  "grabify",
  "redtu",
  "liveleak",
  "brazz",
  "bangbr",
  "wetting",
  "nude",
  "naked",
  "sex",
  "r34",
  "rule34",
  "e621",
  "gore",
  "milf",
  "vagina",
  "pussy",
  "slut",
  "penis",
  "dick",
  "ass",
  "gore",
  "gay p",
  "prn",
  "d1ck",
  "p0rn",
  "pen15"
]

const imageSearch = require('image-recognition')
const discord = require('discord.js')


exports.run = (client, message, args, level) => {
    var canPost = true
    var nsfw = message.channel.nsfw
    let attachment = message.attachments.array()[0]
    if (!attachment) {
      return message.channel.send("Please provide an image!")
    }

    new imageSearch(attachment.url, function(res) {
      if (res) {
        message.channel.send(res)
      } else {
        message.channel.send("Couldn't recognize that image..")
      }

    })



    })


}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["findimage"],
    permLevel: "Voter"
};

exports.help = {
    name: "imagefind",
    category: "Image",
    description: "Returns some image keywords based on your image!",
    usage: "imagefind {picture}"
};
