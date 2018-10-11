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
        if (!adminRoles[roleMention.id]) {
          delete adminRoles[roleMention.id]
          message.channel.send("Users in the role `" + roleMention.name + "` no longer have administrator permissions!")
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("This role is not listed as an administrator role!")
        }
        if (adminRoles[userMention.id]) {
          delete adminRoles[userMention.id]
          message.channel.send(`${userMention.user.tag} is no longer a server administrator!`)
          client.saveGuildData(guild, JSON.stringify(data))
        } else {
          message.channel.send("That user is not listed as a server administrator!")
        }
      }
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["del-admin-role", "deladmin", "deladmin"],
    permLevel: "Server Owner"
};

exports.help = {
    name: "removeadmin",
    category: "Moderation",
    description: "Removes a user or role to the Administrator permission level.",
    usage: "removeadmin (user ping or role ping)"
};
