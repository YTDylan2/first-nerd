exports.run = async (client, message, args, level) => {
    let member = message.mentions.members.first()
    if (!member) {
      return message.channel.send(client.responseEmojis.fluster + " Can you please provide a user?")
    }
    let picture = member.user.avatarURL
    message.channel.send("Avatar for " + member.user.username + ": " + picture)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["pfp"],
    permLevel: "User"
};

exports.help = {
    name: "avatar",
    category: "Info",
    description: "Gets the avatar of another user.",
    usage: "avatar [user]"
};
