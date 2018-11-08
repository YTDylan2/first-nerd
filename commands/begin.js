// Add new data for users
const discord = require('discord.js')

exports.run = async (client, message, args, level) => {
    let guild = message.guild
    let member = message.member

    client.getGuildData(guild).then(reply => {
      if (reply) {
        let gData = JSON.parse(reply)
        let serverData = gData.playerData.players
        if (!serverData[member.id]) {
          serverData[member.id] = client.config.defaultPlayerData
          client.saveGuildData(guild, JSON.stringify(gData)).then(done => {
            let embed = new discord.RichEmbed()
            embed.setAuthor(member.user.tag, member.user.avatarURL)
            embed.setDescription("Welcome to the club, " + member.user.tag + "!")
            embed.addField("Successfully started your save!", "You've successfully started the box game!")
            embed.setFooter("Welcome, " + member.user.tag, member.user.avatarURL)
            embed.setColor(process.env.green)
            embed.setTimestamp()
            message.channel.send({embed})
          }).catch(e => {
            return message.channel.send("A database error has occured. Please join the support server and contact the owner.")
          })

          // add more data here
        } else {
          return message.channel.send("Looks like you already have a save for this server!")
        }
      } else {
        message.channel.send("It seems like your guild has no data. Auto updating...")
        client.updateGuilds().then(updated => {
          message.channel.send("Alright, done! Please run this command again.")
        })
        return;
      }
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "User"
};

exports.help = {
    name: "begin",
    category: "WIP Commands",
    description: "Begin your journey here!",
    usage: "begin"
};
