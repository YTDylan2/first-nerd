const discord = require('discord.js')

exports.run = (client, message, args, level) => {
    let guild = message.guild
    let category = args[0].toLowerCase()
    let commandsArray = client.commands.array()

    let foundCategories = {}
    if (!category ) {
      return message.channel.send("A category name is needed!")
    }
    for (x in commandsArray) {
      let command = commandsArray[x]
      if (!foundCategories[command.conf.category.toLowerCase()]) {
        foundCategories[command.conf.category.toLowerCase()] = true
      }
    }
    if (!foundCategories[category]) {
      return message.channel.send("This category does not exist!")
    }


    client.getGuildData(guild).then(response => {
      let data = JSON.parse(response)
      if (data) {
        let disabledCategories = data.data.disabledCategories
        if (disabledCategories[category]) {
          delete disabledCategories[category]
          message.channel.send("Category **" + category + "** enabled!")
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("This category is already enabled!")
        }
      }
    })

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["enable-category"],
    permLevel: "Administrator",
};

exports.help = {
    name: "enablecategory",
    category: "Moderation",
    description: "Enables a category of commands",
    usage: "enablecategory [category name]"
};
