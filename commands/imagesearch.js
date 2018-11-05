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

const googleImages = require('google-images')
const discord = require('discord.js')
const google_client = new googleImages(process.env.CSE_KEY, process.env.G_API_KEY)

exports.run = (client, message, args, level) => {
    if (!client.voters[message.author.id]) return message.channel.send("You can't run this command unless you vote!\nVote me at https://discordbots.org/bot/411683313926012928/vote")
    var canPost = true
    var nsfw = message.channel.nsfw
    let search = args.join(" ")
    if (search === undefined) {
        message.channel.send("Please send something to search!")
        return;
    }

    for (x in badLinks) {
      if (search.toLowerCase().match(badLinks[x])) {
        canPost = false;
        break
      }
    }

    google_client.search(search).then(images => {
      let image = images[0]
      if (!image) {
        let thumbnail = image.thumbnail
        let size = Math.floor(image.size / 1000)
        let dimension = image.width + "x" + image.height
        let embed = new discord.RichEmbed()
        embed.setAuthor("Image Result for '" + search + "'")
        embed.setDescription("Image type: " + image.type)
        embed.addField("Image Filesize", "**~" + size + "KB**")
        embed.setThumbnail(thumbnail.url)
        embed.setFooter("Dimensions: " + dimension + " ~Vanessa")
        embed.setTimestamp()
        if (canPost) {
          message.channel.send({embed})
        } else {
          if (nsfw) {
            message.channel.send({embed})
          } else {
            message.channel.send("This image would be inappropiate based on your search query. Please try this in an NSFW channel.")
          }
        }
      } else {
        return message.channel.send("Couldn't find an image for that!")
      }

    })


}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["searchimage", "image-search"],
    permLevel: "Voter"
};

exports.help = {
    name: "imagesearch",
    category: "Image",
    description: "Finds an image based on your query!",
    usage: "imagesearch [...search terms]"
};
