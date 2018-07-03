// verify

exports.run = (client, message, args, level) => {
    let username = args[1]
    var discord = require('discord.js')
    var enmap = require(
    let reason = args[1]
    if (!username || username == undefined) {
       message.channel.send("You need to send a valid username!")
       return;
    }
    if (username) {
      message.channel.send("You have chosen to verify your discord account with the ROBLOX user **" + username "**. Is this correct? Say `Yes` or `No`.")
      message.channel.send('What tag would you like to see? This will await will be cancelled in 30 seconds. It will finish when you provide a message that goes through the filter the first time.')
      .then(() => {
        message.channel.awaitMessages(response => response.content.toLower() === 'yes' || response => response.content.toLower() === 'no', {
          max: 1,
          time: 30000,
          errors: ['time'],
        })
        .then((collected) => {
            message.channel.send("Response: " + collected.first().content)
          })
          .catch(() => {
            message.channel.send('You failed to respond within 30 seconds. Verification timed out.')
          });
      });
    }
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
