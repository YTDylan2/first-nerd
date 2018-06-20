exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    let text = message.content.slice("a!post".length)
    if (text.length === 0) {
        message.channel.send("Blank?");
        return;
    }
    if (!message.author.id == '240639333567168512') {
        message.channel.send("You can't do that! You're not the owner.");
        return;
    }
    if (text.length > 0 && message.author.id == '240639333567168512') {
       roblox.post(process.env.groupid, text)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["post"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "post",
    category: "Fun",
    description: "Posts something to the group wall of Galactic Games.",
    usage: "post [text]"
};
