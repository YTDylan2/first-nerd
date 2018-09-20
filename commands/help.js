/*
redesigning this command

would now use embeds
*/

  


exports.run = (client, message, args, level) => {
  // if no specific command is called show all commands
  const discord = require("discord.js")
  
  function seperateStrings(strings) {
    return strings.join(", ")
  }
  let id = 0
  if (message.guild) {
    id = message.guild.id
  }
  client.redisClient.get(id + "-SETTINGS", function(err, response) {
    let settings = JSON.parse(response)
    if (!settings) {
      settings = client.config.defaultSettings
    }
                           
    if (!args[0]) {
      // load guild settings (for prefixes and eventually per guild tweaks)

      const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);


      const embed = new discord.RichEmbed()

      let sortedCommands = {}
      let arrayCmds = myCommands.array()
      for (var x in arrayCmds) {
        let cmd = arrayCmds[x]
        if (cmd.help) {        
          if (!sortedCommands[cmd.help.category]) {
            sortedCommands[cmd.help.category] = [cmd.help.name]
          } else {
            sortedCommands[cmd.help.category].push([cmd.help.name])
          }
        }
      }

      embed.setTitle("Vanessa's Commands")

      for (var x in sortedCommands) {
        let seperated = seperateStrings(sortedCommands[x])
        embed.addField(x, seperated)
      }
      embed.setColor(process.env.purple)
      embed.setTimestamp()
      embed.setAuthor("Vanessa", client.user.avatarURL)
      embed.setFooter("dlivie was here owo", client.user.avatarURL)
      embed.setDescription("A full list of commands! Use " +`**${settings.prefix}help [command name]** ` + "to get more help on a command!")
      message.channel.send({embed});
    } else {
      // show command's help.
      let command = args[0];
      if (client.commands.has(command)) {
        command = client.commands.get(command);
        if (level < client.levelCache[command.conf.permLevel]) {
          message.channel.send("Uh oh! Looks like you can't use this command!")
          return;
        }
        let embed = new discord.RichEmbed()
        .setTitle(settings.prefix + command.help.name)
        .setDescription(command.help.description)
        .addField("Usage", "`" + `${settings.prefix}${command.help.usage}` + "`")
        .addField("Security", command.conf.permLevel + "+")
        if (command.conf.aliases.length > 0) {
          embed.addField("Aliases", command.conf.aliases.join(", "))
        }                
        embed.setColor(process.env.purple)
        message.channel.send({embed})
      }
    }
  })
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["halp", "commands"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "Info",
  description: "Displays all the available commands for Vanessa! These will only display commands your level of access.",
  usage: "help [command]"
};
