// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.
function matchMention(text) {
   var mentionTag1 = '<@411683313926012928> '
   var mentionTag2 = '<@!411683313926012928> '
   if (text.indexOf(mentionTag1) == 0) {
     return text.slice(mentionTag1.length)
   }
   if (text.indexOf(mentionTag2) == 0) {
       return text.slice(mentionTag2.length)
   }
   return;
}

module.exports = (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  
  // Grab the settings for this server from the PersistentCollection
  // If there is no guild, get default conf (DMs)
  
  // For ease of use in commands and functions, we'll attach the settings
  // to the message object, so `message.settings` is accessible.
    let mentions = message.mentions.members
    let match =  matchMention(message.content)   
    if (match) {
      message.channel.startTyping()
      client.cleverbot.create(function(bad, session) {
         if (match != "help") {            
            client.cleverbot.ask(match, function(err, response) {
               message.channel.send(response + ' <@!' + message.author.id + '>')
               message.channel.stopTyping()
            })
         } else {
            let helpCmd = client.commands.get("help")
            helpCmd.run(client, message, [], client.permLevel(message))
         }
      })
   }              
   if (message) {
     client.redisClient.get(message.guild.id + "-SETTINGS", function(err, data) {
         let settings = JSON.parse(data)
         if (!settings) {
            settings = client.config.defaultSettings
         }

         message.settings = settings;
         

         // Also good practice to ignore any message that does not start with our prefix,
         // which is set in the configuration file.
         if (message.content.indexOf(settings.prefix !== 0) && message.content.indexOf(settings.prefix.toUpperCase()) !== 0) return;

         // Here we separate our "command" name, and our "arguments" for the command.
         // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
         // command = say
         // args = ["Is", "this", "the", "real", "life?"]
         const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
         const command = args.shift().toLowerCase();

         // Get the user or member's permission level from the elevation
         const level = client.permlevel(message);

         // Check whether the command, or alias, exist in the collections defined
         // in app.js.
         const cmd = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()));
         // using this const varName = thing OR otherthign; is a pretty efficient
         // and clean way to grab one of 2 values!
         // clever bot

         if (!cmd) return;

         // Some commands may not be useable in DMs. This check prevents those commands from running
         // and return a friendly error message.
         if (cmd && !message.guild && cmd.conf.guildOnly)
          return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

         if (level < client.levelCache[cmd.conf.permLevel]) {
            return message.channel.send(`You're missing the required permission (${cmd.conf.permLevel}) to use this command!`)
         }

         // don't run if disabled
         if (cmd.conf.enabled == false) {
            return message.channel.send("Looks like this command is disabled.")
         }

         // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
         // The "level" command module argument will be deprecated in the future.
         message.author.permLevel = level;

         message.flags = [];
         while (args[0] && args[0][0] === "-") {
          message.flags.push(args.shift().slice(1));
         }
         // If the command exists, **AND** the user has permission, run it.
         client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
         client.lastCommand = settings.prefix + cmd.help.name
         cmd.run(client, message, args, level);
     })
  }
};
                         
