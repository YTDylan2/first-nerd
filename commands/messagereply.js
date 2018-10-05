exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    let userId = args[0]
    let text = message.content.slice("a!messagereply".length + args[0].length + 1)
    if (text.length === 0) {
        message.channel.send("Blank?");
        return;
    }
    if (!message.author.id == '240639333567168512') {
        message.channel.send("You can't do that! You're not the owner.");
        return;
    }
    if (text.length > 0 && message.author.id == '240639333567168512') {
       //roblox.login("GCRBOT", process.env.rbxpass)
       // let jar = roblox.jar();
       message.channel.send("cmd broke")
       // roblox.message(userId, "Message Reply", "test", jar)
        // .catch(function (err) {
           // message.channel.send("Message error: " + err.toString())
           // console.error(err)
       // });
    }
}

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: ["messagereply"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "messagereply",
    category: "Vault",
    description: "Replies to a message on ROBLOX.",
    usage: "replymessage [userId] [text]"
};
