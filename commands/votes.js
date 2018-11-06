exports.run = async (client, message, args, level) => {
    let bot = await client.botlistclient.getBot(client.user.id)
    if (bot) {
      let votes = bot.points
      message.channel.send("I have **" + votes + "** votes!")
    } else {
      return message.channel.send("An internal error occurred. Please contact the bot owner.")
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "User"
};

exports.help = {
    name: "votes",
    category: "Info",
    description: "Returns the amount of votes on Discord Bot List!",
    usage: "votes"
};
