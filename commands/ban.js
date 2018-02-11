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
    enabled: true,
    guildOnly: false,
    aliases: ["hammer, banland"],
    permLevel: "Administrator"
};

exports.help = {
    name: "ban",
    category: "Moderation",
    description: "Bans a user. Reason needed. Moderators are specified as members who have a role with the Manage Messages permission.",
    usage: "ban [user] [reason]"
};


