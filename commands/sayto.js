// say text

exports.run = (client, message, [channel, ...args], level) => {
    let saychannel = message.guild.channels.find(c => c.name.toLowerCase() == channel.toLowerCase())
    let text = args.join(" ")
    if (!saychannel) {
      return message.channel.send("Please send the valid **name** of a channel, not the mention! Such as `general`, `announcements`, etc.")
    }
    let permissions = saychannel.permissionsFor(message.member.id)
    if (!permissions) {
      return message.channel.send("You must have permission to speak in <#" + saychannel.id + ">!")
    }

    let allowed = permissions.has('SEND_MESSAGES', true)
    if (!allowed) {
      return message.channel.send("You must have permission to speak in <#" + saychannel.id + ">!")
    }
    if (text.match("@everyone") || text.match("@here")) {
        message.channel.send("<@" + message.author.id + ">" + " just tried to mention everyone. Shame with you!");
        return;
    }
    if (text.length === 0) {
        message.channel.send("Blank?");
        return;
    }
    if (text.length > 0 && !text.match("@everyone") && !text.match("@here")) {
        message.delete()
        saychannel.send(text).then({
          // yay
        }).catch(e => {
          let stringE = e.toString()
          if (stringE.match("Permissions")) {
            return message.channel.send("Sorry, but I don't have permissions to speak in <#" + saychannel.id + ">!")
          }
        })
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["speakto"],
    permLevel: "User"
};

exports.help = {
    name: "sayto",
    category: "Fun",
    description: "Will mimic and say the content you give it to another channel",
    usage: "sayto [channel] [...text]"
};
