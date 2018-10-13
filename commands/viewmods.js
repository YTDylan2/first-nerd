const discord = require('discord.js');

exports.run = (client, message, args, level) => {
  let guild = message.guild
  client.getGuildData(guild).then(response => {
    let data = JSON.parse(response)
    if (!data) return;
    let modRoles = data.data.modRoles
    let adminRoles = data.data.adminRoles

    let finalModRoles = {
      'roles' : [],
      'users' : []
    }
    let finalAdminRoles = {
      'roles' : [],
      'users' : []
    }
    for (x in modRoles) {
      let role = guild.roles.get(x.toString())
      let user = client.users.get(x.toString())

      if (role) {
        finalModRoles.roles.push(role.name)
      }
      if (user) {
        finalModRoles.users.push('`' + user.tag + '`')
      }
    }
    for (x in adminRoles) {
      let role = guild.roles.get(x.toString())
      let user = client.users.get(x.toString())

      if (role) {
        finalAdminRoles.roles.push(role.name)
      }
      if (user) {
        finalAdminRoles.users.push('`' + user.tag + '`')
      }
    }

    var embed = new discord.RichEmbed()
    embed.setTitle("Server Moderators and Administrators")
    embed.setDescription("These are the moderators and administrators for your server!")
    embed.addField("Moderator Bound Roles", finalModRoles.roles.join(", ") || "None")
    embed.addField("Moderator Bound Users", finalModRoles.users.join(", ") || "None")
    embed.addField("Admin Bound Roles", finalAdminRoles.roles.join(", ") || "None")
    embed.addField("Admin Bound Users", finalAdminRoles.users.join(", ") || "None")
    embed.setFooter("Powered by Vanessa", client.user.avatarURL)
    embed.setTimestamp()
    embed.setColor(process.env.blue)
    message.channel.send({embed})
  })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["servermods"],
    permLevel: "Moderator"
};

exports.help = {
    name: "viewmods",
    category: "Moderation",
    description: "Views all the mod - admin roles and users on your server.",
    usage: "viewmods"
};
