// clear messages

exports.run = (client, message, args, level) => {
    var google = require('google')
    let links = []
    let search = args.join(" ")
    if (search === undefined) {
        message.channel.send("Please send something to search!")
        return;
    }
    google(search, async (err, res) => {
        if (!res.links[0].link) {
            message.channel.send("There were no search results.")
            return
        } else {
            message.channel.send(res.links[0].link)
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


