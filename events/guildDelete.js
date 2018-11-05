// This event executes when a new guild (server) is left.
const discord = require('discord.js')

module.exports = (client, guild) => {
  // Well they're gone. Let's remove them from the settings!
    client.delData(guild.id);
    let embed = new discord.RichEmbed()
    embed.setTitle("Guild Left!")
    embed.addField("Guild Name", guild.name)
    embed.addField("Guild ID", guild.id)
    embed.addField("Users Lost", guild.members.size)
    embed.setColor(process.env.red)
    embed.setFooter("Left " + guild.name + " - Vanessa")
    embed.setTimestamp()
    client.guildLogs.send({embed})
};
