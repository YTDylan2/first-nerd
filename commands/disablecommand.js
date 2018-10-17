const discord = require('discord.js')

exports.run = (client, message, args, level) => {
    let guild = message.guild
    let cmd = args[0]
    if (!cmd) {
      return message.channel.send("A command name is needed!")
    }
    if (!client.commands.get(cmd)) {
      return message.channel.send("That command was not found! You can't disable a command by an alias.")
    }

    if (cmd == "disablecommand" || cmd == "enablecommand") {
      return message.channel.send("This command cannot be disabled!")
    }
    cmd = cmd.toLowerCase()

    client.getGuildData(guild).then(response => {
      let data = JSON.parse(response)
      if (data) {
        let disabledCommands = data.data.disabledCommands
        if (!disabledCommands[cmd]) {
          disabledCommands[cmd] = true
          message.channel.send("Command **" + cmd + "** disabled!")
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("This command is already disabled!")
        }
      }
    })

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["disable-command"],
    permLevel: "Administrator",
};

exports.help = {
    name: "disablecommand",
    category: "Moderation",
    description: "Disables a command. This command cannot be disabled.\nYou can view all disabled commands by using `>help`",
    usage: "disablecommand [cmd name]"
};
