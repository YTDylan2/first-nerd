exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    var num = 0
    let text = args.join(" ")
    var post = require("snekfetch");
    var body = await post("https://www.hastebin.com/documents").send(text);
    message.channel.send(`Sent to https://www.hastebin.com/${body.key}.txt`)

    
        
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "hastebin",
    category: "Fun",
    description: "Posts to hastebin!",
    usage: "hastebin [...]"
};
