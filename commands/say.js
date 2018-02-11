// say text

exports.run = (client, message, args, level) => {
    let text = message.content.slice("a!say".length)
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
        message.channel.send(text)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["speak"],
    permLevel: "User"
};

exports.help = {
    name: "say",
    category: "Fun",
    description: "Will mimic and say the content you give it!",
    usage: "say [text]"
};


