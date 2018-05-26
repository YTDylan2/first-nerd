exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    let text = message.content.slice("a!shout".length)
    if (text.length === 0) {
        message.channel.send("Blank?");
        return;
    }
    if (!message.author.id == '240639333567168512') {
        message.channel.send("You can't do that! You're not the owner.");
        return;
    }
    if (text.length > 0 && message.author.id == '240639333567168512') {
       roblox.shout(4044556, text)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["shout"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "shout",
    category: "Fun",
    description: "Posts something to the group shout of Galactic Games.",
    usage: "shout [text]"
};
