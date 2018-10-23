const discord = require('discord.js')
exports.run = async (client, message, args, level) => {
    let data = client.galaxyClickerItems
    let item = args.join(" ")
    let itemArray = [
      "Only items with rarities above Uncommon are displayed.\n"
    ]
    if (!data) {
      return message.channel.send("Sorry, it does not seem like the data has been uploaded. Contact the owner and try again later.");
    }
    for (x in data) {
     let item = data[x] 
     itemArray.push(`#{item.Number} - ${item.Name} - ${item.RAP} RAP, ${item.Value} Value, Rarity: ${item.Rarity})
    }
    itemArray = itemArray.join("\n")
    client.hastebin(itemArray).then(link => {
      message.channel.send("Uploaded at " + link)
    }).catch(err => {
      message.channel.send("An error occurred. The services may be down.")
    })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["listitems", "allitems"],
    permLevel: "User"
};

exports.help = {
    name: "itemlist",
    category: "Galaxy Clicker Reawakened",
    description: "Find all items ingame.",
    usage: "itemlist"
};
