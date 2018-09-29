// server shop!
const discord = require('discord.js')

function getArgsPastIndex(index, array) {
    let x;
    let args = []
    for (x in array) {
        if (x >= index) {
            args.push(array[x])
        }
    }
  return args
}

function convertArray(json) {
    let array = []
    for (var i in json) {
        array.push(json[i])
    }
    return array
}

function shopToEmbed(shop, channel, client) {
    let items = shop.items
    let settings = shop.settings
    let embed = new discord.RichEmbed()
    let itemsArray = convertArray(items)
    if (itemsArray.length > 0) {

        embed.setTitle(settings.name)
        embed.setDescription(settings.description)
        for (var x in items) {
            let item = items[x]
            let price = item.price
            let desc = item.description
            embed.addField(x, `**Cost: ${price} coins**\n${desc}`)
        }
        embed.setThumbnail(settings.icon)
        embed.setFooter("jesse has the ultra fats", client.user.avatarURL)
        embed.setColor(process.env.green)
        embed.setTimestamp()
        channel.send({embed})
    } else {
        channel.send("Doesn't look like anything is up for sale!")
    }
}

function addRoleToMember(member, roleID, channel, client) {
    if (client.checkPerm(channel.guild.members.get(client.id), "MANAGE_ROLES")) {
        if (client.roles.get(roleID)) {
            channel.send("It seems you have already purchased this role!")
            return false
        } else {
            member.addRole(roleID)
            .then(r =>  {
                channel.send("Role successfully purchased!")
                return true
            })
            .catch(error => {
                channel.send("There was an error adding your role!")
                return false
            })

        }
    } else {
        channel.send("I don't have the `Manage Roles` permission! Please check and try this again.")
        return false
    }
}

async function createRole(name, message, client) {
  if (client.checkPerm(message.channel.guild.members.get(client.id), "MANAGE_ROLES")) {
      let role = await message.guild.createRole({name: name})
      return role
    })
  } else {
    message.channel.send("I don't have the `Manage Roles` permission! Please check this and try again.")
  }
}


exports.run = (client, message, args, level) => {
    let guild = message.guild
    let guildKey = guild.id + '-SHOPTEST3'
    let playerCoins = message.author.id + '-coins'
    let def = {
        'items': {

        },
        'settings' : {
            name: guild.name + "'s Shop",
            description: 'No description set.',
            icon : 'https://cdn.discordapp.com/attachments/414573970374000640/493501939816988673/vanessa_shop_icon.png'
        }
    }
    let acceptableTypes = {
        "Role" : true,
    }

    client.redisClient.get(guildKey, function(err, response) {
        if (response) {
            let shopData = JSON.parse(response)
            let action = args[0]
            if (!action) {
                shopToEmbed(shopData, message.channel, client)
                return
            }
            if (action == 'reset') {
                if (level >= 4) {
                    client.redisClient.set(guildKey, JSON.stringify(def))
                    message.channel.send("Shop successfully reset!")
                }
                return
            }


            // shop configuration
            if (action == 'buy') {

            }

            if (action == 'additem') {
              if (level < 4) return;
              let filter = m => m.author.id === message.author.id
              message.channel.send("**This currently only supports roles!**")
              message.channel.send("What will this role's name be?")
              message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
              .then(collected => {
                let name = collected.first().content
                if (shopData[name.toProperCase()]) {
                  return message.channel.send("This item already exists!")
                }
                message.channel.send("What will the price be?")
                message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
                .then(collected => {
                    let price = parseInt(collected.first().content)
                    if (!price) {
                      return message.channel.send("That doesn't seem like a number...")
                    }
                    message.channel.send("Set the description for this role, and it will be finished!")
                    message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
                    .then(collected => {
                      let description = collected.first().content
                      let newrole = createRole(name, message, client)
                      if (newrole) {
                        shopData[name.toProperCase()] = {
                          'name' : name.toProperCase(),
                          'description' : description,
                          'type' : 'Role',
                          'roleID' : newrole.id
                        }
                        client.redisClient.set(guildKey, JSON.stringify(shopData), function(err, reply) {
                          if (reply) {
                            message.channel.send("Added item to the shop!")
                          }
                        })
                      }
                    })
                })
              })
            }
            if (action == 'seticon') {
                if (level >= 4) {
                    let pictures = message.attachments.array()
                    if (pictures.length == 0) {
                        return message.channel.send("Please upload an icon to the message!")
                    } else {
                        let picture = pictures[0]
                        shopData.settings.icon = picture.url
                        client.redisClient.set(guildKey, JSON.stringify(shopData), function(err, response) {
                            message.channel.send("Shop icon was successfully updated!")
                        })
                    }
                }
            }
            if (action == 'setdesc') {
                 if (level >= 4) {
                     let desc = getArgsPastIndex(1, args)
                     desc = desc.join(" ")
                     if (desc.length == 0) {
                         return message.channel.send("Please send a description for your shop!")
                     } else {
                         shopData.settings.description = desc
                         client.redisClient.set(guildKey, JSON.stringify(shopData), function(err, response) {
                            message.channel.send("Shop description was successfully updated!")
                         })
                     }
                 }
            }
            if (action == 'setname') {
                 if (level >= 4) {
                     let name = getArgsPastIndex(1, args)
                     name = name.join(" ")
                     if (name.length == 0) {
                         shopData.settings.name = guild.name + "'s Shop"
                         client.redisClient.set(guildKey, JSON.stringify(shopData), function(err, response) {
                            message.channel.send("Shop name was set to the default naming.")
                         })
                     } else {
                         shopData.settings.name = name
                         client.redisClient.set(guildKey, JSON.stringify(shopData), function(err, response) {
                            message.channel.send("Shop name was successfully updated!")
                         })
                     }
                 }
            }
        } else {
            client.redisClient.set(guildKey, JSON.stringify(def), function(err, response) {
                message.channel.send("Hold on, I've just set the basic settings for your server shop!")
            })
        }
    })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["shop"],
    permLevel: "User"
};

exports.help = {
    name: "store",
    category: "Development",
    description: "This command is under development!",
    usage: "store [action, ..name]"
};
