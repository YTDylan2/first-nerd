exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
  message.reply(`your permission level is: ${level} - ${friendly}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["permlevel"],
  permLevel: "User"
};

exports.help = {
  name: "perms",
  category: "Misc",
  description: "Tells you your permissions level for the current message location.",
  usage: "perms"
};
