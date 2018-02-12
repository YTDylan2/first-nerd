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
            url: "https://discord.gg/HeSq8Ze",
            description: "Find information about Aureum Studios!",
            fields: [{
                name: "Info",
                value: "Aureum Studios is a bot developed to be the main bot for the ROBLOX group Aureum Studios. It's also a bot that can be used for moderation and some fun on your server! 😃\n`Current Guilds: " + client.guilds.size + "`\n`Current Users: " + client.users.size + "`" 
            },
            {
                name: "Owners / Developers",
                value: "@techno turret#0907 - Owner and Developer"
            },
            {
                name: "Other Links",
                value: "You can find the roblox group [here](https://www.roblox.com/My/Groups.aspx?gid=3643510), and the discord server [here](https://discord.gg/HeSq8Ze)."
            },
            {
                name: "Special Thanks",
                value: "Special thanks to Flatbird, Alipear, and RagingBudgie for starting the idea and helping to test the bot!"
            },
            ],
        },
    });
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["info, about"],
    permLevel: "User"
};

exports.help = {
    name: "botinfo",
    category: "Info",
    description: "Shows bot information.",
    usage: "botinfo"
};


