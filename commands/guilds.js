// guilds
const ordinal = require('ordinal-js')

exports.run = async (client, message, args, level) => {
    let guilds = client.guilds.array()
    let guildCount = client.guilds.size
    message.channel.send("Currently in `" + guildCount + "` guilds.")
    guilds.sort(function(b, a) {
      return b.members.size - a.members.size
    })
    let output = []
    for (x in guilds) {
      let guild = guilds[x]
      let pos = parseInt(x) + 1
      output.push(`${ordinal.toOrdinal(pos)} place: ${guild.name}\nMembers: ${guild.members.size}\nID: ${guild.id}\n`)
    }
    output = output.join("\n")
    client.hastebin(output)
    .then(link => {
      message.channel.send("Guild data posted at " + link)
    }).catch(e => {
      message.channel.send("There was an error trying to upload guild data to Hastebin.")
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["servers"],
    permLevel: "User"
};

exports.help = {
    name: "guilds",
    category: "Info",
    description: "Shows how many guilds this bot is in!",
    usage: "guilds"
};
