// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  // Well they're gone. Let's remove them from the settings!
    client.settings.delete(guild.id);
client.user.setActivity("Techno World. Use a!help. Serving " + client.users.size + " users in " + client.guilds.size + " servers." , "Hi.", "https://www.roblox.com/My/Groups.aspx?gid=3643510", "PLAYING")
};
