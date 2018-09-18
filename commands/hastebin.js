exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    var num = 0
    let text = args.join(" ")
    const { post } = require("snekfetch");
    const { body } = post("https://www.hastebin.com/documents").send(text);
    // message.channel.send(`Sent to https://www.hastebin.com/${body.key}.txt`)

    
        
}

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: [""],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "hastebin",
    category: "Development",
    description: "e",
    usage: "hastebin [words]"
};
