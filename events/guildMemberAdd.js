const discord = require('discord.js')

module.exports = (client, member) => {
  // Load the guild's settings
  client.getGuildData(member.guild).then(reply => {
    if (reply) {
      let settings = JSON.parse(reply)
      settings = settings.settings
      if (settings.welcomeEnabled == "true") {
          // replace the {user} in the welcome message with actual data
        var welcomeMessage = settings.welcomeMessage.replace("{user}", member.user.username)
        welcomeMessage = welcomeMessage.replace("{mention}", "<@" + member.id + ">")
        welcomeMessage = welcomeMessage.replace("{server-name}", member.guild.name)
        welcomeMessage = welcomeMessage.replace("{count}", member.guild.members.size.toLocaleString())

        let file = member.user.avatarURL

        let channel = member.guild.channels.find(c => c.name == settings.welcomeChannel)
        if (channel) {
          let embed = new discord.RichEmbed()
          embed.setAuthor(member.user.tag, member.user.avatarURL)
          embed.setImage(file)
          embed.setFooter("Powered by Vanessa")
          embed.setTimestamp()
          if (settings.welcomeAvatarPicture !== "true") {
            channel.send(welcomeMessage).catch(console.log(""))
          } else {
            channel.send(welcomeMessage, {embed: embed}).catch(console.log(""))
          }

        }
        // empty cause it's just that they didn't set it yet
      }
    } else {
      // console.log("error welcoming in guild " + member.guild.name)
    }
  })
};
