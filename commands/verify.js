// verify

exports.run = (client, message, args, level) => {
    let username = args[0]
    var discord = require('discord.js')
    var redis = require('redis')
    if (!username || username == undefined) {
       message.channel.send("You need to send a valid username!")
       return;
    }
    if (username) {
      message.channel.send("You have chosen to verify your discord account with the ROBLOX user **" + username + "**. Is this correct? Say `Yes` or `No`.")
      .then(() => {
        message.channel.awaitMessages(response => response.author.id == message.author.id && (response.content.toLowerCase().match('yes') || response.content.toLowerCase().match('no')), {
            max: 1,
            time: 60000,
            errors: ['time'],
        }).then(collected => {
              if (response.content.match('yes') {
                message.channel.send("path 1")
              }
              if (response.content.match('no') { 
                 message.channel.send("path 2")
              }
        })

        
                                                                         
       }).catch(() => {
          message.channel.send('You failed to respond within 1 minute! Your verification timed out. :(')
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
