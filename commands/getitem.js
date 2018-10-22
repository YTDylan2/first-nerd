const discord = require('discord.js')
exports.run = async (client, message, args, level) => {
    let data = client.galaxyClickerItems
    let item = args.join(" ")
    if (!data) {
      return message.channel.send("Sorry, it does not seem like the data has been uploaded. Contact the owner and try again later.");
    }
    if (!item || item === undefined) {
      return message.channel.send("An item name is needed!");
    }
    if (message.guild.id != client.galaxyClickerGuildID) {
      return message.channel.send("This command can only be run in the Galaxy Clicker guild.");
    }
    let itemData = data[item.toLowerCase()]
    if (itemData) {
      let embed = new discord.RichEmbed()
      embed.setTitle(itemData.Name)
      embed.addField("RAP", itemData.Price)
      embed.addField("Value", itemData.Value)
      embed.addField("Rarity", itemData.Rarity)
      embed.setColor(itemData.Color)
      embed.setThumbnail(itemData.ThumbnailURL)
      embed.setFooter("Item #" + itemData.Index + " - Vanessa")
      message.channel.send({embed})
    } else {
      return message.channel.send("This item does not exist in the game!");
    };
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["finditem"],
    permLevel: "User"
};

exports.help = {
    name: "getitem",
    category: "Galaxy Clicker Reawakened",
    description: "Find the stats of an item in the game.",
    usage: "getitem [name]"
};
