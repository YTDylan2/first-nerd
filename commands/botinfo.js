// ban user

exports.run = (client, message, args, level) => {
    message.channel.send({
        embed: {
            color: 3447003,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            title: "Support Server",
            url: "https://discord.gg/bVJ8WJk",
            description: "Find information about Vannesa!\n**DISCLAIMER: While using the Cleverbot integration, your conversations may be viewed but not recorded for future reference.**",
            fields: [{
                name: "Info",
                value: `I am  ${client.user.username}, the culimation of water is ice soup's creativity.\nI'm also a great listener. Just ping me.\nCurrent Guilds: ${client.guilds.size}\nEvery user I've seen: ${client.users.size}`
            },
           
            {
                name: "Owners / Developers",
                value: "@water is ice soup#0907 - Owner and Developer"
            },
            {
                name: "Features",
                value: `Cleverbot (@ the bot with some text)\nTranslation\nSoon to be moderation\nEconomic system`
            },
            {
                name: "Special Thanks",
                value: "Special thanks to Flatbird, and Rewolf for getting the idea underway and testing the bot!\nThanks alot to Budgie for being a great help with the hosting!"
            },
            ],
        },
    });
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["info", "support"],
    permLevel: "User"
};

exports.help = {
    name: "support",
    category: "Info",
    description: "Shows bot information.",
    usage: "support",
};


