// verify

exports.run = (client, message, args, level) => {
    let username = args[0]
    var discord = require('discord.js')
    var redis = require('redis')
    var roblox = require('roblox-js')
       
    // bad argument
    if (!username || username == undefined) {
       message.channel.send("You need to send a valid username!")
       return;
    }
   roblox.getIdFromUsername(username)
    .then(id => { 
        // already verified
        client.redisClient.get(message.author.id, function(err, reply) {
            if (reply != null) {
                 message.channel.send(`You've already been verified to **${reply}**!`)
                 return;
            }
        })

        // trying to verify to another user
        var storedData = client.redisClient.get(id.toString(), function(err, reply) {
             if (reply != null) {
                 var user = client.users.get(reply)
                 if (user) { 
                    message.channel.send("That roblox account has already been verified to **" + user.username + "**!")
                    return;
                 }             
             }
        })

        if (id != null) {
          message.channel.send("You have chosen to verify your discord account with the ROBLOX user **" + username + "**. Is this correct? Say `Yes` or `No`. (is this you?) - https://www.roblox.com/users/" + id +"/profile")
            message.channel.awaitMessages(response => response.author.id == message.author.id && (response.content.toLowerCase().match('yes') || response.content.toLowerCase().match('no')), {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then(collected => {
                  if (collected.first().content.match('yes')) {
                     message.channel.send("Please place the words:\n\n**Waterblob Verification**\n\ninto your STATUS (What are you up to?) section. Reply 'finished' when done so.")
                     message.channel.awaitMessages(response => response.author.id == message.author.id && (response.content.toLowerCase().match('finished')), {
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    }).then(collected => {
                         roblox.getStatus(id)
                         .then(status => {
                             if (status.toLowerCase().match('waterblob verification')) {
                                 client.redisClient.set(message.author.id, id.toString())
                                 client.redisClient.set(id.toString(), message.author.id())
                                 message.channel.send('✅ Successfully verified!')
                             }
                             if (!status.toLowerCase().match('waterblob verification')) {
                                 message.channel.send('❎ oof... could not verify you. Did you enter the phrase into your status correctly?')
                             }
                         })
                     }).catch(() => {
                         message.channel.send("oof, your verification timed out!")
                     })
                  }
                  if (collected.first().content.match('no')) { 
                     message.channel.send("Verification cancelled.")
                  }
            }).catch(() => {
              message.channel.send('You failed to respond within 1 minute! Your verification timed out. :(')
            })                                                                                 
       };
    }).catch(() => { 
        message.channel.send("You need to send a valid username! Case sensitive.") 
        return; 
    }) 
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
