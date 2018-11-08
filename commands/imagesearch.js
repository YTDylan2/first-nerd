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
  "pen15",
  "blue waf",
  "cock",
  "cancer",
  "p3nis",
  "pen1s",
  "pvss",
  "boob",
  "b00b",
  "b0ob",
  "bo0b",
  "breast",
  "br3ast",
  "br34s",
  "t1t",
  "ti1t3",
  "tit",
  "sperm",
  "sp3rm",
  "pnis",
  "fap",
  "masturb",
  "f4p",
  "hot anime girls", // smfh uno
  "h3nt",
  
]

const googleImages = require('g-i-s')
const discord = require('discord.js')

exports.run = (client, message, args, level) => {
    if (!client.voters[message.author.id]) return message.channel.send("You can't run this command unless you vote!\nVote me at https://discordbots.org/bot/411683313926012928/vote\n\n**It may take a while for your vote to register, so use >checkvote to check the status of your vote.**")
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

    googleImages(search, function(error, images) {
      let rImage = Math.floor(Math.random() * images.length)
      let image = images[rImage] || images[0]
      if (image) {
        let dimension = image.width + "x" + image.height
        let embed = new discord.RichEmbed()
        embed.setAuthor("Image Result for '" + search + "'")
        embed.addField("Dimensions", dimension, true)
        embed.addField("Result #", rImage + " out of " + images.length + " possible results", true)
        embed.setImage(image.url)
        embed.setFooter("Requested by " + message.author.tag, message.author.avatarURL)
        embed.setColor(process.env.green)
        embed.setTimestamp()
        for (x in badLinks) {
          if (image.url.toLowerCase().match(badLinks[x])) {
            canPost = false;
            break
          }
        }
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
        console.log(error)
        return message.channel.send("Couldn't find an image for that!")
      }

    })


}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["searchimage", "image-search", "imgsrch", "imgsearch"],
    permLevel: "Voter"
};

exports.help = {
    name: "imagesearch",
    category: "Image",
    description: "Finds an image based on your query! This command cannot filter every single result out.\nThis command requires you to have voted on Vanessa!",
    usage: "imagesearch [...search terms]"
};
