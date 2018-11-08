module.exports = (client, member) => {
  // Load the guild's settings
  client.getGuildData(member.guild).then(reply => {
    if (reply) {
      let settings = JSON.parse(reply)
      settings = settings.settings
      if (settings.welcomeEnabled == "true") {
          // replace the {user} in the welcome message with actual data
        const welcomeMessage = settings.welcomeMessage.replace("{user}", member.user.username)
        member.guild.channels.find(c => c.name == settings.welcomeChannel).send(welcomeMessage).catch(console.log)
      }
    } else {
      console.log("error welcoming in guild " + member.guild.name)
    }
  })
};
