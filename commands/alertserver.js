exports.run = async (client, message, args, level) => {
    let text = args.join(" ")
    let unnotified = []
    if (text == undefined || text.length == 0) {
      return message.channel.send("Need a query!")
    }
    
    let confirmation = await client.awaitReply(message, "Are you sure you want to proceed? Proceeding will message everyone in the server with a signature from you.\nThis will not message users who have blocked the bot. Say 'yes' or 'no' to continue.")
    if (["n", "no", "stop", "cancel"].includes(confirmation)) {
        message.channel.send("Command was cancelled. " + client.responseEmojis.hmm)
        return;
    }
    if (["yes", "proceed", "go"].includes(confirmation)) {
        let users = message.guild.members.array()
        let usersNotified = 0
        for (x in users) {
          try {
           users[x].user.send(text + "\n\nSent by " + message.member.user.tag)
          } catch (err) {
            // nothing
            unnotified.push(err)
          }

        }
        await client.wait(7000)
        let num = users.length - unnotified.length
        message.channel.send(`Out of **${users.length}** users, ${num} were notified.`)
    }
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
