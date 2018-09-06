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
        })
        .then((collected) => {
          if (response.content.match('yes') {
            
          } else {
            message.channel.send("Verification request cancelled.")
          }
          message.channel.send("Please add the following words to your personal bio/info page:\n\n```Waterblob Verification```\nReply 'done' when you have done so!") 
            message.channel.awaitMessages(response => response.author.id == message.author.id && (response.content.toLowerCase().match('done'), {
            max: 1,
            time: 120000,
            errors: ['time'],
        }).then((collected) => {
           message.channel.send("this is where we check the data boy")
        }).catch(() => {
          message.channel.send('You failed to complete the prompt within 2 minutes! Your verification timed out. :(')
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
