exports.run = async (client, message, args, level) => {
    let text = args.join(" ")
    if (text == undefined || text.length == 0) {
      return message.channel.send("Need a query!")
    }
    let users = message.guild.members.array()
    let usersNotified = 0
    for (x in users) {
      try {
       users[x].user.send(text)
       usersNotified = usersNotified + 1
      } catch (err) {
        // nothing
        usersNotified = usersNotified - 1
      }

    }
    await client.wait(10000)
    message.channel.send(`Out of **${users.length}** users, ${usersNotified} were notified.`)
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
