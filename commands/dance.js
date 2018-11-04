exports.run = async (client, message, args, level) => {
  let random = Math.floor(Math.random() * 10)
  if (random == 1) {
    message.channel.send(client.responseEmojis.dance1 + " " + client.responseEmojis.dance2)
    message.channel.send("you hit the 10% chance for both. enjoy! " + client.responseEmojis.wink)
    return
  }
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
