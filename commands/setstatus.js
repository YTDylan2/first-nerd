exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let status = args.join(" ")
  if (!status || status === undefined) {
    return message.channel.send("status needed please\nsay `enable random` to enable random status")
  }
  if (status == "enable random") {
    client.allowRandomStatuses = true
    return message.channel.send("done")
  } else {
    client.allowRandomStatuses = false
    client.user.setActivity(status, {type: 'PLAYING'})
    message.channel.send("random status disabled and set status to: " + status)
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["setgame"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "setstatus",
  category: "System",
  description: "Sets bot status.",
  usage: "setstaus [status or toggle message]"
};
