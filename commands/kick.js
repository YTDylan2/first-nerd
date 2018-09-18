// kick user

exports.run = (client, message, args, level) => {
    let user = message.mentions.members.first();
    var discord = require('discord.js')
    let reason = args[1]
    if (reason && user) {
        if (!user.hasPermission("MANAGE_MESSAGES")) {
            user.kick(reason).then(function (member) {
                message.channel.send(`${user} was kicked!`)
            })
        } else {
            message.channel.send("That user is a moderator!")
        }
    } else {
        message.channel.send("Could not kick! Please provide a user `mention` and a `reason`!")
    }
}

exports.conf = {
    enabled: false,
    guildOnly: true,
    aliases: ["boot"],
    permLevel: "Moderator"
};

exports.help = {
    name: "kick",
    category: "Vault",
    description: "Currently being reworked!",
    usage: "kick [user] [reason]"
};


