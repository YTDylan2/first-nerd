// ban user

exports.run = (client, message, args, level) => {
    let user = message.mentions.members.first();
    var discord = require('discord.js')
    let reason = args[1]
    if (reason && user) {
        if (!user.hasPermission("MANAGE_MESSAGES")) {
            user.ban(reason).then(function (member) {
                message.channel.send(`${user} was just banned!`)
            })
        } else {
            message.channel.send("That user is a moderator!")
        }
    } else {
        message.channel.send("Could not ban! Please provide a user `mention` and a `reason`!")
    }
}

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: ["hammer", "banland"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "ban",
    category: "Vault",
    description: "Currently being reworked.",
    usage: "ban [user] [reason]"
};


