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
                value: "water is ice soup's son\n`Current Guilds: " + client.guilds.size + "`\n`Current Users: " + client.users.size + "`" 
            },
            {
                name: "Owners / Developers",
                value: "@water is ice soup#0907 - Owner and Developer"
            },
            {
                name: "Other Links",
                value: `You can find the roblox group [here](https://www.roblox.com/My/Groups.aspx?gid=${process.env.groupid}), and the discord server [here](https://discord.gg/bVJ8WJk).`
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


