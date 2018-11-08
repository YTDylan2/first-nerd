// guilds
const ordinal = require('ordinal-js')

exports.run = async (client, message, args, level) => {
    let guilds = client.guilds.array()
    let guildCount = client.guilds.size
    message.channel.send("Currently in `" + guildCount + "` guilds.")
    guilds.sort(function(a, b) {
      return b.members.size - a.members.size
    })
    let output = []
    for (x in guilds) {
      let guild = guilds[x]
      let pos = parseInt(x) + 1
      let str = `${ordinal.toOrdinal(pos)} place: ${guild.name}\nMembers: ${guild.members.size}\nID: ${guild.id}\n`
      if (guild.id == message.guild.id) {
        str = str + " (This Guild)"
      }
      output.push(str)
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
