// verify

exports.run = (client, message, args, level) => {
    let username = args[0]
    var discord = require('discord.js')
    var redis = require('redis')
    var roblox = require('roblox-js')
    var proceed = true
    
    
    // bad argument
    if (!username || username == undefined) {
       message.channel.send("You need to send a valid username!")
       return;
    }
     message.channel.send('Checking database... 🔄')
    roblox.getIdFromUsername(username)
    .then(id => {
       
        // already verified
        client.getData(message.author.id).then(reply => {
            if (reply != null) {
                 message.channel.send(`❗Warning: You're already linked to an account! Proceeding will replace your current account with the one you choose. Current account: https://roblox.com/users/${reply}/profile`)
                // proceed = !proceed
                // return;
            }
             // trying to verify to another user
            client.getData(id.toString()).then(reply => {
                 if (reply != null && proceed) {
                     var user = client.users.get(reply)
                     if (user) { 
                        message.channel.send("That roblox account has already been verified to Discord User **" + user.tag + "**!")
                        proceed = !proceed
                        return;
                     }             
                 }
                 if (reply == null && proceed) {
                     if (id != null && proceed) {
                        message.channel.send("You have chosen to verify your discord account with the ROBLOX user **" + username + "**. Is this correct? Say `yes` or `no`. (is this you?) - https://www.roblox.com/users/" + id +"/profile")
                        message.channel.awaitMessages(response => response.author.id == message.author.id && (response.content.toLowerCase().match('yes') || response.content.toLowerCase().match('no')), {
                            max: 1,
                            time: 60000,
                            errors: ['time'],
                        }).then(collected => {
                              if (collected.first().content.toLowerCase().match('yes')) {
                                 message.channel.send("Please place the words:\n\n**dog cat lol**\n\ninto your status or feed section. Not your profile description! Reply 'finished' when done so.")
                                 message.channel.awaitMessages(response => response.author.id == message.author.id && (response.content.toLowerCase().match('finished')), {
                                    max: 1,
                                    time: 120000,
                                    errors: ['time'],
                                }).then(collected => {
                                     roblox.getStatus(id)
                                     .then(status => {
                                         if (status.toLowerCase().match('dog cat lol')) {
                                             client.setData(message.author.id, id.toString())
                                             client.setData(id.toString(), message.author.id)
                                             message.channel.send('✅ Successfully verified!')
                                         }
                                         if (!status.toLowerCase().match('dog cat lol')) {
                                             message.channel.send('❎ oof... could not verify you. Did you enter the phrase into your status correctly?')
                                         }
                                     })
                                 }).catch(() => {
                                     message.channel.send("oof, your verification timed out!")
                                 })
                              }
                              if (collected.first().content.toLowerCase().match('no')) { 
                                 message.channel.send("Verification cancelled.")
                              }
                        }).catch(() => {
                          message.channel.send('You failed to respond within 1 minute! Your verification timed out. :(')
                        })                                                                                 
                   };
                 }
            })  
        })
    })
    .catch(() => { 
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
    description: "Verify your discord user with your roblox user using Vanessa!",
    usage: "verify [username]"
};
