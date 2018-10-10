// This event executes when a new guild (server) is joined.
const discord = require('discord.js')

let info = {
  field1 : [
    "You can use Cleverbot with Vanessa!\n" +
    "To use it, all you need to do is ping her with any text.\n" +
    //"You can also use this feature in DMs! She will not respond with Cleverbot API to a message starting with `[ignore]`.\n" +
    "**When using the Cleverbot feature, please keep in mind the owner has full access to view conversations.\nThey are viewed for tweaking the bot to be more user friendly."
  ],
  field2 : [
    "Vanessa has a full economy system, much like UnbelieveaBoat.\n" +
    "You can >work, >crime, >lb, etc.\n" +
    "If you ever want to disable these, you can with `>disable category economy`."
  ],
  field3 : [
    "There is also a ROBLOX verification system put in place.\n" +
    "It is accessable by using `>verify username`. You can get any linked user using `>roblox [tag]`."
  ],
  field4 : [
    "Vanessa has many settings you can modify, such as the prefix, economy, and etc.\n" +
    "Please use `>settings` to view your setting configuration.\n" +
    "Vanessa will alert you if your settings need an update."
  ]
}
module.exports = (client, guild) => {
  let id = guild.id
  client.setData(id, client.config.defaultSettings).then(r => {
    if (r) {
      if (guild.systemChannelID) {
        let channel = guild.channels.get(guild.systemChannelID)
        if (channel) {
          let embed = new discord.RichEmbed()
          embed.setTitle("Thanks for inviting me!")
          embed.setDescription("Thank you for inviting Vanessa to your server!")
          embed.setURL("http://discord.gg/" + process.env.supportServerCode)
          embed.addField("Cleverbot", info.field1[0])
          embed.addField("Economy", info.field2[0])
          embed.addField("Roblox Verification", info.field3[0])
          embed.addField("Other", info.field4[0])
          embed.setFooter("Stuck? Use >help")
          embed.setTimestamp()
          channel.send({embed})
        }
      }
    }
  })
};
