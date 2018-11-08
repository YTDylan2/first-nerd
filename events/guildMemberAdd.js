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
        member.guild.channels.find(c => c.name == settings.welcomeChannel).send(welcomeMessage).catch(console.log(""))
        // empty cause it's just that they didn't set it yet
      }
    } else {
      // console.log("error welcoming in guild " + member.guild.name)
    }
  })
};
