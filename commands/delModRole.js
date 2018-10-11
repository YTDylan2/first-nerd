exports.run = (client, message, args, level) => {
    let guild = message.guild

    let roleMention = message.mentions.roles.first()
    let userMention = message.mentions.members.first()
    if (!roleMention && !userMention) {
      return message.channel.send("Please mention a user or role!")
    }

    client.getGuildData(guild).then(response => {
      let data = JSON.parse(response)
      if (data) {
        let modRoles = data.data.modRoles
        if (roleMention && modRoles[roleMention.id]) {
          delete modRoles[roleMention.id]
          message.channel.send("Users in the role `" + roleMention.name + "` no longer have moderator permissions!")
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("This role is not listed a moderator role!")
        }
        if (userMention && modRoles[userMention.id]) {
          delete modRoles[userMention.id]
          message.channel.send(`${userMention.user.tag} is no longer a server moderator!`)
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("That user is not listed as a server moderator!")
        }
      }
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["del-mod-role", "delmod"],
    permLevel: "Administrator"
};

exports.help = {
    name: "removemod",
    category: "Moderation",
    description: "Removes a user or role to the Moderator permission level.",
    usage: "removemod (user ping or role ping)"
};
