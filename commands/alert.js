exports.run = async (client, message, args, level) => {
    let text = args.join(" ")
    if (text == undefined || text.length == 0) {
      return message.channel.send("Need a query!")
    }
    let users = client.users.array()
    let usersNotified = 0
    for (x in users) {
      try {
       await users[x].send(text)
       usersNotified = usersNotified + 1
      } catch (err) {
        // nothing
        console.log(err)
      }

    }
    message.channel.send(`Out of **${users.length}** users, ${usersNotified} were notified.`)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["dmall"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "alert",
    category: "System",
    description: "Please don't piss everyone off.",
    usage: "alert [alert]"
};
