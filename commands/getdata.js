// case legends exclusive

exports.run = (client, message, args, level) => {
    let data = client.caseLegendsPlayerData
    let Discord = require('discord.js')
    let key = args[0]
    let found = false;
    if (key === undefined) {
        message.reply("A key is needed to get stats. `Say " + client.config.defaultSettings.prefix + "check [user OR userId]`")
        return;
    }
    let keyParse = parseInt(key)
    if (isNaN(keyParse)) {
        // this is a name.
        for (x in data) {
            var dataTable = data[x]
            if (dataTable) {
                found = true
                var RAP = dataTable.RAP
                var itemCount = dataTable.Itemcount
                var highItem = dataTable.HighestItem
                var bux = dataTable.Bux
                var rebirths = dataTable.Rebirths
                var rubies = dataTable.Rubies
                var CPO = dataTable.Cases
                var uniqueItems = dataTable.UniqueItemCount
                const embed = new Discord.RichEmbed()
                .addField("Player's RAP", RAP)
                .addField("Player's Case-Bux", bux)
                .addField("Player's Rubies", rubies)
                .addField("Player's Rebirths", rebirths)
                .addField("Player's Cases Per Open", CPO)
                .addField("Player's Item Count", itemCount)
                .addField("Item with Highest Amount", highItem)
                .addField("Unique Amount of Items In Inventory", uniqueItems)
                .setTitle(`Stats for ${dataTable.name}`)
                .setDescription(`The data retrieved for ${dataTable.name}. Updated every 30 seconds if the user ingame. Returns their last save if not ingame.`)
                .setColor(16776960)
                // .setImage('https://i.imgur.com/zwMrlQT.png')
                .setThumbnail('https://www.roblox.com/bust-thumbnail/image?userId='+ dataTable.userId + '&width=420&height=420&format=png')
                .setAuthor("WaterIsIceSoup | water", 'https://i.imgur.com/qMyW7KX.png')
                .setFooter("Provided by WaterIsIceSoup", 'https://i.imgur.com/qMyW7KX.png')
                .setTimestamp()
                message.channel.send({embed})
                break;
            }
        }
    }
    // this is a userId.
    if (!isNaN(keyParse)) {
        for (x in data) {
            var dataTable = data[x]
            if (dataTable.userId.toLowerCase() == key.toLowerCase()) {
                found = true
                var RAP = dataTable.RAP
                var itemCount = dataTable.Itemcount
                var highItem = dataTable.HighestItem
                var bux = dataTable.Bux
                var rebirths = dataTable.Rebirths
                var rubies = dataTable.Rubies
                var CPO = dataTable.Cases
                var uniqueItems = dataTable.UniqueItemCount
                const embed = new Discord.RichEmbed()
                .addField("Player's RAP", RAP)
                .addField("Player's Case-Bux", bux)
                .addField("Player's Rubies", rubies)
                .addField("Player's Rebirths", rebirths)
                .addField("Player's Cases Per Open", CPO)
                .addField("Player's Item Count", itemCount)
                .addField("Item with Highest Amount", highItem)
                .addField("Unique Amount of Items In Inventory", uniqueItems)
                .setTitle(`Stats for ${dataTable.name}`)
                .setDescription(`The data retrieved for ${dataTable.name}. Updated every 30 seconds if the user ingame. Returns their last save if not ingame.`)
                .setColor(16776960)
                // .setImage('https://i.imgur.com/zwMrlQT.png')
                .setThumbnail('https://www.roblox.com/bust-thumbnail/image?userId='+ dataTable.userId + '&width=420&height=420&format=png')
                .setAuthor("WaterIsIceSoup | water", 'https://i.imgur.com/qMyW7KX.png')
                .setFooter("Provided by WaterIsIceSoup", 'https://i.imgur.com/qMyW7KX.png')
                .setTimestamp()
                message.channel.send({embed})
                break;
            }
        }
    }
    if (found == false) {
        message.reply("The user has not joined after this update was applied, or the user is invalid.")
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "Administrator"
};

exports.help = {
    name: "check",
    category: "Roblox",
    description: "For data persistence testing.",
    usage: "check [user OR userId]"
};
