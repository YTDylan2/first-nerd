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
        if (!modRoles[roleMention.id]) {
          modRoles[roleMention.id] = true
          message.channel.send("Users in the role `" + roleMention.name + "` now have moderator permissions!")
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("This role is already a moderator role!")
        }
        if (!modRoles[userMention.id]) {
          modRoles[userMention.id] = true
          message.channel.send(`${userMention.user.tag} is now a server moderator!`)
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("That user is already a server moderator!")
        }
      }
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["add-mod-role", "addmod"],
    permLevel: "Administrator"
};

exports.help = {
    name: "setmod",
    category: "Moderation",
    description: "Adds a user or role to the Moderator permission level.",
    usage: "setmod (user ping or role ping)"
};
