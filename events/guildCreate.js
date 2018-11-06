// This event executes when a new guild (server) is joined.
const discord = require('discord.js')
const ordinal = require('ordinal-js')

let info = {
  field1 : [
    "You can use Cleverbot with Vanessa!\n" +
    "To use it, all you need to do is ping her with any text.\n" +
    "This feature also works in Direct Messages."
    //"You can also use this feature in DMs! She will not respond with Cleverbot API to a message starting with `[ignore]`.\n" +
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
  ],
  field5: [
    "There is also a moderation system.\n" +
    "You can find most of the commands in the Moderation section.\n" +
    "Moderation and Info categorized commands cannot be disabled category wide."
  ],
  field6: [
    "Upvoting helps our recognition! Upvote [here!](https://discordbots.org/bot/411683313926012928/vote)"
  ]
}
module.exports = (client, guild) => {
  let id = guild.id
  client.setData(id, JSON.stringify(client.config.defaultSettings)).then(r => {
    if (r) {
      if (guild.systemChannelID) {
        let channel = guild.channels.get(guild.systemChannelID)
        if (channel) {
          let embed = new discord.RichEmbed()
          embed.setTitle("Thanks for inviting me!")
          embed.setDescription("Thank you for inviting Vanessa to your server! Fun fact: You are the " + ordinal.toOrdinal(client.guilds.size) + " to add the bot!")
          embed.setURL("http://discord.gg/" + process.env.supportServerCode)
          embed.addField("Cleverbot", info.field1[0])
          embed.addField("Economy", info.field2[0])
          embed.addField("Roblox Verification", info.field3[0])
          embed.addField("Moderation", info.field5[0])
          embed.addField("Helping out", info.field6[0])
          embed.addField("Other", info.field4[0])

          embed.setFooter("Stuck? Use >help")
          embed.setTimestamp()
          embed.setColor(process.env.blue)
          channel.send({embed}).catch(e => {
            client.startChannel.send("There was an error trying to welcome guild " + guild.name + "\n\n" + client.clean(client, e.stack) )
          })


        }
      }
    }
  })
  let log = new discord.RichEmbed()
  log.setTitle("Guild Joined!")
  log.addField("Guild Name", guild.name)
  log.addField("Guild ID", guild.id)
  log.addField("Users", guild.members.size)
  log.addField("My " + ordinal.toOrdinal(client.guilds.size) + " guild", "Guild #" + client.guilds.size)
  log.setColor(process.env.blue)
  log.setFooter("Joined " + guild.name + " - Vanessa")
  log.setTimestamp()
  client.guildLogs.send({embed: log})
};
