exports.run = async (client, message, args, level) => {
  let random = Math.floor(Math.random() * 10)
  if (random < 5) {
    message.channel.send(client.responseEmojis.dance1)
  } else {
    message.channel.send(client.responseEmojis.dance2)
  }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["shakeit"],
    permLevel: "User"
};

exports.help = {
    name: "dance",
    category: "Fun",
    description: "Dancing is fun!",
    usage: "dance"
};  
