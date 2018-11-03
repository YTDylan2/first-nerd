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
                message.channel.send("I couldn't find that person. Did you double check your spelling? " + client.responseEmojis.hmm)
            });
    }
    else
        message.channel.send("Please provide a username.")
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["rbxuser", "findrbx"],
    permLevel: "User"
};

exports.help = {
    name: "robloxuser",
    category: "Roblox",
    description: "Gives the profile of a roblox user.",
    usage: "robloxuser [username]"
};
