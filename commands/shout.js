exports.run = (client, message, args, level) => {
    var roblox = require('noblox.js')
    let text = args.join(" ")
    if (text.length === 0) {
        message.channel.send("Blank?");
        return;
    }
    if (!message.author.id == '240639333567168512') {
        message.channel.send("You can't do that! You're not the owner.");
        return;
    }
    if (text.length > 0 && message.author.id == '240639333567168512') {
       roblox.shout(process.env.groupid, text).then(() => {
           message.channel.send("Shout was posted!")
       }).catch(err => {
           message.channel.send("Oof! Got this error: " + err)
        })
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
    category: "Personal",
    description: "Posts something to the group shout of Galactic Games.",
    usage: "shout [text]"
};
