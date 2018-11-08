const discord = require('discord.js')

exports.run = async (client, message, args, level) => {
    let member = message.mentions.members.first() || client.findGuildUser(message, args[0])
    if (!member) {
      return message.channel.send(client.responseEmojis.fluster + " Can you please provide a user?")
    }
    member = member.user || member
    let picture = member.avatarURL

    var embed = new discord.RichEmbed()
    embed.setAuthor(member.tag + "'s Avatar", picture)
    embed.setImage(picture)
    embed.setColor(process.env.blue)
    message.channel.send({embed})
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
