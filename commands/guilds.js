// ban user

exports.run = async (client, message, args, level) => {
    let guilds = client.guilds.array()
    let guildCount = client.guilds.size
    message.channel.send("Currently in `" + guildCount + "` guilds.")

    let output = []
    for (x in guilds) {
      let guild = guilds[x]
      output.push(`${guild.name} - ${guild.id}\nMembers: ${guild.members.size}`)
    }
    output = output.join("\n")
    client.hastebin(output)
    .then(link => {
      message.channel.send("Guild data posted at " + link)
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
