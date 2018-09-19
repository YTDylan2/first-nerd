exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.channel.send("Night night.");
  client.commands.forEach( async cmd => {
    await client.unloadCommand(cmd);
  });
  // await client.redisClient.exit()
  await client.startChannel.send("shut down, restarting")
  process.exit(143);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["restart", "shutdown"],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Restarts the bot!",
  usage: "reboot"
};
