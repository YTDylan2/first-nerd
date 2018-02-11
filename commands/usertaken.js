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
            message.channel.send(`The username **${username}** is not taken.`)
        }
    });
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["chkuser, checkuser"],
    permLevel: "User"
};

exports.help = {
    name: "usertaken",
    category: "Info",
    description: "Returns yes or no if the specified username is taken.",
    usage: "usertaken [username]"
};


