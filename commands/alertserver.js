exports.run = async (client, message, args, level) => {
    let text = args.join(" ")
    let unnotified = []
    if (text == undefined || text.length == 0) {
      return message.channel.send("Need a query!")
    }
    let users = message.guild.members.array()
    let usersNotified = 0
    for (x in users) {
      try {
       users[x].user.send(text)
      } catch (err) {
        // nothing
        unnotified.push(err)
      }

    }
    await client.wait(10000)
    let num = users.length - unnotified.length
    message.channel.send(`Out of **${users.length}** users, ${num} were notified.`)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["dmserver"],
    permLevel: "Server Owner"
};

exports.help = {
    name: "alertserver",
    category: "System",
    description: "Alerts an entire server. Usable by server owners.",
    usage: "alertserver [alert]"
};
