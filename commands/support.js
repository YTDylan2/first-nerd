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
            url: "https://discord.gg/" + process.env.supportServerCode,
            description: "Find information about Vannesa!",
            fields: [{
                name: "Info",
                value: `I am ${client.user.username}, the culimation of water is ice soup's creativity.\nI'm also a great listener. Just ping me.\nCurrent Guild Count: ${client.guilds.size}\nNumber of Users: ${client.users.size}`
            },

            {
                name: "Owners / Developers",
                value: "<@240639333567168512> - Owner and Bot Developer"
            },
            {
                name: "Features",
                value: "Cleverbot (@ the bot with some text)\nTranslation\nModeration\nEconomic system\nCustomizable settings"
            },
            {
                name: "Special Thanks",
                value: "Special thanks to Flatbird, and <@382426073008439306> for helping test the bot!\nThanks alot to <@205093576865087497> for being a great help with the hosting!\nI'm also happy this inspired <@491337614717353994> to make a Discord bot!"
            },
            {
                name: "Invite Link",
                value: "It is up to you which permissions she has. Invite her [here.](https://discordapp.com/oauth2/authorize?client_id=411683313926012928&scope=bot&permissions=322566)"
            },

            {
                name: "Help the bot!",
                value: "You can help the bot by upvoting [here.](https://discordbots.org/bot/411683313926012928/vote)\nBy upvoting, you get access to the `imagesearch` command!"
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
