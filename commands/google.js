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
  "bangb",
  "wetting",
  "nude",
  "naked",
  "sex",
  "r34",
  "rule34",
  "e621",
  "gore",
  "milf",
]


exports.run = (client, message, args, level) => {
    var google = require('google')
    var canPost = true

    let links = []
    let search = args.join(" ")
    if (search === undefined) {
        message.channel.send("Please send something to search!")
        return;
    }
    search = client.removeAccents(search)
    google(search, async (err, response) => {
        let res = response
        if (!res.links[0].link) {
            message.channel.send("There were no search results.")
            return
        } else {

            for (x in badLinks) {
              if (res.links[0].link.toString().toLowerCase().match(badLinks[x])) {
                canPost = false
                break;
              }
            }
            if (canPost) {
              message.channel.send(res.links[0].link)
            } else {
              message.channel.send("Sorry! The content on that page would be deemed inappropiate.")
            }

        }
    })

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["search"],
    permLevel: "User"
};

exports.help = {
    name: "google",
    category: "Fun",
    description: "Googles stuff. You know?",
    usage: "google [...search terms]"
};
