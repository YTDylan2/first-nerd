module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  var ordinal = require('ordinal-js')
  await client.wait(1000);
  //client.startChannel = client.channels.get('491777217920106508')

  client.startChannel.send("began running")
  let buildVer = process.env.HEROKU_RELEASE_VERSION
  let numb = buildVer.match(/\d/g);
  numb = numb.join("");
  numb = parseInt(numb)
  // Both `wait` and `client.log` are in `./modules/functions`.
  client.logger.log(`[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");
  client.user.setActivity(`in the ${ordinal.toOrdinal(numb)} timeline. Use ${process.env.prefix}help. ` + client.guilds.size + " guilds." , "Hi.", "https://www.roblox.com/My/Groups.aspx?gid=3643510", "PLAYING")
  // We check for any guilds added while the bot was offline, if any were, they get a default configuration.
  // client.guilds.filter(g => !client.redisCient.get(g.id)).forEach(g => client.redisClient.set(g.id, client.config.defaultSettings));
  for (var g in client.guilds) {
    let guild = client.guilds[g]
    client.redisClient.get(guild.id + '-SETTINGS', function(err, reply) {
      let settings = JSON.parse(reply)
      if (!reply) {
        client.redisClient.set(guild.id + '-SETTINGS', JSON.stringify(client.config.defaultSettings))
      } else {
        for (x in client.config.defaultSettings) {
          if (!settings[x]) {
            settings[x] = client.config.defaultSettings[x]
          }
          client.redisClient.set(guild.id + '-SETTINGS', JSON.stringify(settings))
        }
      }
    }
  }
};
