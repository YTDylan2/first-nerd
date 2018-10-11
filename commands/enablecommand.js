const discord = require('discord.js')

exports.run = (client, message, args, level) => {
    let guild = message.guild
    let cmd = args[0]
    if (!cmd) {
      return message.channel.send("A command name is needed!")
    }
    if (!client.commands.get(cmd)) {
      return message.channel.send("That command was not found! You can't enable a command by an alias.")
    }
    cmd = cmd.toLowerCase()

    client.getGuildData(guild).then(response => {
      let data = JSON.parse(response)
      if (data) {
        let disabledCommands = data.data.disabledCommands
        if (disabledCommands[cmd]) {
          delete disabledCommands[cmd]
          message.channel.send("Command **" + cmd + "** enabled!")
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("This command is already enabled!")
        }
      }
    })

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["enable-command"],
    permLevel: "Administrator",
};

exports.help = {
    name: "enablecommand",
    category: "Moderation",
    description: "Enables a command. This command cannot be disabled.",
    usage: "enablecommand [cmd name]"
};
