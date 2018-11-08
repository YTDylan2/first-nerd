exports.run = async (client, message, args, level) => {
  message.channel.send(client.responseEmojis.woop).then(m => message.delete())
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "User"
};

exports.help = {
    name: "woop",
    category: "Fun",
    description: "woop woop wOOp",
    usage: "woop"
};
