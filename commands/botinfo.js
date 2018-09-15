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
            description: "Find information about WaterIsIceSoup!",
            fields: [{
                name: "Info",
                value: `I am  ${client.user.username}, the culimation of water is ice soup's creativity.\nI'm also a great listener. Just ping me.\nCurrent Guilds: ${client.guilds.size}\nEvery user I've seen: ${client.users.size}`
            },
           
            {
                name: "Owners / Developers",
                value: "@water is ice soup#0907 - Owner and Developer"
            },
            {
                name: "Other Links",
                value: `You can find his roblox group [here](https://www.roblox.com/My/Groups.aspx?gid=${process.env.groupid}), and the discord server [here](https://discord.gg/bVJ8WJk).`
            },
            {
                name: "Special Thanks",
                value: "Special thanks to Flatbird, and Rewolf-nori for gettomg the idea underway and testing the bot!\nThanks alot to Budgie for being a great help with the hosting!"
            },
            ],
        },
    });
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["info, about, support"],
    permLevel: "User"
};

exports.help = {
    name: "botinfo",
    category: "Info",
    description: "Shows bot information.",
    usage: "botinfo"
};


