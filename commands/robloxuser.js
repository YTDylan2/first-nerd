// give user

exports.run = (client, message, args, level) => {
    var roblox = require("roblox-js")
    let username = args[0]
    if (username) {
        roblox.getIdFromUsername(username)
            .then(function (id) {
                if (id) {
                    message.channel.send("Profile of " + username + ": https://roblox.com/users/" + id + "/profile")
                }

            }).catch(function (err) {
                message.channel.send("Could not find " + username + ". Did you type the name correctly?")
            });
    }
    else
        message.channel.send("Please provide a username.")
}

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: ["rbxuser"],
    permLevel: "User"
};

exports.help = {
    name: "robloxuser",
    category: "Vault",
    description: "Gives the profile of a roblox user.\nVaulted in favor of verification system!",
    usage: "robloxuser [username]"
};


