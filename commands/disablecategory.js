const discord = require('discord.js')

exports.run = (client, message, args, level) => {
    let guild = message.guild
    let category = args[0]
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
    if (category == "Info" || category == "Moderation") {
      return message.channel.send("You cannot disable this category!")
    }

    category = category.toLowerCase()

    client.getGuildData(guild).then(response => {
      let data = JSON.parse(response)
      if (data) {
        let disabledCategories = data.data.disabledCategories
        if (!disabledCategories[category]) {
          disabledCategories[category] = true
          message.channel.send("Category **" + category + "** disabled!")
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("This category is already disabled!")
        }
      }
    })

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["disable-category"],
    permLevel: "Administrator",
};

exports.help = {
    name: "disablecategory",
    category: "Moderation",
    description: "Disables a category of commands",
    usage: "disablecategory [category name]"
};
