exports.run = async (client, message, args, level) => {
  message.channel.send(client.responseEmojis.highfive1 + client.responseEmojis.highfive2)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["remfive"],
    permLevel: "User"
};

exports.help = {
    name: "highfive",
    category: "Fun",
    description: "A high five.",
    usage: "highfive"
};
