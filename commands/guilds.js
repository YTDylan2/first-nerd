// ban user

exports.run = (client, message, args, level) => {
    let guilds = client.guilds.size
    message.channel.send("Currently in `" + guilds + "` guilds.")
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["servers"],
    permLevel: "User"
};

exports.help = {
    name: "guilds",
    category: "Info",
    description: "Shows how many guilds this bot is in!",
    usage: "guilds"
};


