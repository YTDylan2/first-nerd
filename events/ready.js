module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  var ordinal = require('ordinal-js')
  await client.wait(1000);
  //client.startChannel = client.channels.get('491777217920106508')

  let buildVer = process.env.HEROKU_RELEASE_VERSION
  let numb = buildVer.match(/\d/g);
  numb = numb.join("");
  numb = parseInt(numb)
  // Both `wait` and `client.log` are in `./modules/functions`.
  client.logger.log(`[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");
  client.user.setActivity(`in the ${ordinal.toOrdinal(numb)} timeline. Use ${process.env.prefix}help. ` + client.guilds.size + " guilds.", "PLAYING")

  let emojis = {
    "hmm": '508090899662897152',
    'highfive1': '508089207126884363',
    'highfive2': '508089347317170186',
    'scream': '508090283045552128',
    'wink': '508090308861624320',
    'dance1': '508088654585921556',
    'dance2': '508091101568172042',
    'cry': '508095193560645652',
    'fluster': '508090330030276619',
    'grr': '508089705141633034',
    'wtf': '508089722715766784',
    'wave': '508101901498187788',
    'huh': '508102916905762867'
  }
  client.responseEmojis = {}

  for (x in emojis) {
    client.responseEmojis[x] = client.emojis.get(emojis[x]).toString()
  }
  
  client.guildLogs = client.channels.get('503384922564722688')
  // We check for any guilds added while the bot was offline, if any were, they get a default configuration.
  // client.guilds.filter(g => !client.redisCient.get(g.id)).forEach(g => client.redisClient.set(g.id, client.config.defaultSettings));


};
