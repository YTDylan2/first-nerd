// check taken
exports.run = (client, message, args, level) => {
    let username = args[0]
    var https = require('request')
    https('https://www.roblox.com/UserCheck/DoesUsernameExist?username=' + username, { json: true }, (err, res, body) => {
        if (err) {
            message.channel.send("Error retreiving data.")
            return console.log(err);
        }
        if (body.success) {
            message.channel.send(`The username **${username}** is taken.`)
        } else {
            message.channel.send(`The username **${username}** is not taken. Sniping time?`)
        }
    });
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["snipe"],
    permLevel: "User"
};

exports.help = {
    name: "checkuser",
    category: "Roblox",
    description: "Says Yes or No if the specified username in Roblox is taken.",
    usage: "checkuser [username]"
};
