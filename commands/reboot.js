exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.channel.send("ok brb");
  client.commands.forEach( async cmd => {
    await client.unloadCommand(cmd);
  });
  // await client.collection.db.close();
  process.exit(143);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "reboot"
};
