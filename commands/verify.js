// verify

exports.run = (client, message, args, level) => {
    let username = args[0]
    var discord = require('discord.js')
    var enmap = require('enmap')
    if (!username || username == undefined) {
       message.channel.send("You need to send a valid username!")
       return;
    }
    if (username) {
      message.channel.send("You have chosen to verify your discord account with the ROBLOX user **" + username + "**. Is this correct? Say `Yes` or `No`.")
      .then(() => {
        message.channel.awaitMessages(response => response.author.id == message.author.id, {
            max: 1,
            time: 30000,
            errors: ['time'],
        })
        .then((collected) => {
          message.channel.send("Your choice was " + collected.first().content)
        })
        .catch(() => {
          message.channel.send('You failed to respond within 1 minute! Your verification timed out. :(')
        });
     });
   };
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "User"
};

exports.help = {
    name: "verify",
    category: "Roblox",
    description: "Verify your discord user with your roblox user using Waterblob!",
    usage: "verify [username]"
};
