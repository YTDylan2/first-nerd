module.exports = (client, member) => {
  // Load the guild's settings
  client.getGuildData(member.guild).then(settings => {
    if (settings) {
      settings = JSON.parse(settings)
      if (settings.welcomeEnabled !== "true") return;

      // replace the {user} in the welcome message with actual data
      const welcomeMessage = settings.welcomeMessage.replace("{user}", member.user.username)
      member.guild.channels.find("name", settings.welcomeChannel).send(welcomeMessage).catch(console.log)
    }
  })
};
