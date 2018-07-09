exports.run = (client, message, args, level) => {
    let banned = require("../data/groupBan.js")
    const fs = require("fs")
    let toBan = args[0]
    if (!isNaN(parseInt(toBan))) {
      banned[toBan] = true;
      fs.writeFile("../data/groupBan.js", JSON.stringify(banned), (err) => console.error);
      return;
    }
     if (isNaN(parseInt(toBan))) {
      message.reply("Please send a valid userId")
      return;
    }
   
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "groupban",
    category: "Roblox",
    description: "ban cmd",
    usage: "ban [userId]"
};
