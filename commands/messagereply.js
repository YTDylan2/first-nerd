exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    let userId = args[1]
    let text = message.content.slice("a!messagereply".length + args[1].length)
    if (text.length === 0) {
        message.channel.send("Blank?");
        return;
    }
    if (!message.author.id == '240639333567168512') {
        message.channel.send("You can't do that! You're not the owner.");
        return;
    }
    if (text.length > 0 && message.author.id == '240639333567168512') {
       message.channel.send("Message requested to send: " + text)
       roblox.message(userId, "Message Reply", text)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["messagereply"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "messagereply",
    category: "Roblox",
    description: "Replies to a message on ROBLOX.",
    usage: "replymessage [userId] [text]"
};
