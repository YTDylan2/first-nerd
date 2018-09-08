// verify

exports.run = (client, message, args, level) => {
    let username = args[0]
    var discord = require('discord.js')
    var redis = require('redis')
    var roblox = require('roblox-js')
    
    var userData = client.redisClient.get(message.author.id)
    // bad argument
    if (!username || username == undefined) {
       message.channel.send("You need to send a valid username!")
       return;
    }
    var id = roblox.getIdFromUsername(username)
    // not valid user
    if (!id) {
       message.channel.send("You need to send a valid username! Case sensitive.")
       return;
    }
    // already verified
    if (userData != null) {
        message.channel.send(`You've already been verified to ${userData}.`)
        return;
    }
    // trying to verify to another user
    var storedData = client.redisClient.get(id.toString())
    if (storedData != null) {
        message.channel.send("That user has already been verified!")
        return;
    }
    if (id) {
      message.channel.send("You have chosen to verify your discord account with the ROBLOX user **" + username + "**. Is this correct? Say `Yes` or `No`.")
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
                         if (status.lower().match('waterblob verification')) {
                             client.redisClient.set(message.author.id, id.toString())
                             client.redisClient.set(id.toString(), message.author.id())
                             message.channel.send('✅ Successfully verified!')
                         }
                         if (!status.lower().match('waterblob verification')) {
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
