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
        let adminRoles = data.data.adminRoles
        if (roleMention && !adminRoles[roleMention.id]) {
          adminRoles[roleMention.id] = true
          message.channel.send("Users in the role `" + roleMention.name + "` now have administrator permissions!")
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          if (!roleMention) {
          message.channel.send("This role is already an administrator role!")
              }
        }
        if (userMention && !adminRoles[userMention.id]) {
          adminRoles[userMention.id] = true
          message.channel.send(`${userMention.user.tag} is now a server administrator!`)
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          if (!userMention) {
          message.channel.send("That user is already a server administrator!")
              }
        }
      }
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["add-admin-role", "admin", "addadmin"],
    permLevel: "Server Owner"
};

exports.help = {
    name: "setadmin",
    category: "Moderation",
    description: "Adds a user or role to the Administrator permission level.",
    usage: "setadmin (user ping or role ping)"
};
