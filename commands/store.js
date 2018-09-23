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

function shopToEmbed(shop, channel, client) {
    let items = shop.items
    let settings = shop.settings
    let embed = new discord.RichEmbed()
    if (items.array().length > 0) {
        
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



exports.run = async (client, message, args, level) => {
    let guild = message.guild
    let guildKey = guild.id + '-SHOPTEST'
    let playerCoins = message.author.id + '-coins'
    var def = {
        'items': {

        },
        'settings' : {
            name: guild.name + "'s Shop",
            description: 'a place where you buy thingies for your shmingies',
            icon : 'https://cdn.discordapp.com/attachments/414573970374000640/493501939816988673/vanessa_shop_icon.png'
        }
    }       
    var acceptableTypes = {
        "Role" : true,
        "None" : true,
        "Item" : true
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
            if (action == 'additem') {
                if (level < 4) return;
                let types = acceptableTypes.array().join("\n")
                const type = await client.awaitReply(message, `What type of item will this be? Choose between ${acceptableTypes.array().length} types **(caSE senSITIve)**:\n ${types}`)
                if (type) {
                    if (!acceptableTypes[type]) {
                       return message.channel.send("That is not an acceptable type!")
                    } else {
                        if (type == "Role") {
                          if (!client.checkPerm(message.guild.members.get(client.id), "MANAGE_ROLES")) {
                              return message.channel.send("Sorry, but I require a role with the `Manage Roles` permission! Check them and try again.")
                          }
                          const name = await client.awaitReply(message, "What will the name of the role be? You can fully customize this role yourself, such as color, position, etc.\nBe warned that if this role is deleted, the shop in the item will not work and you must delete it!\nI cannot add roles that are above me either.")
                          if (name) {
                              const cost = await client.awaitReply(message, "What will the price of the role be?")
                              if (cost) {
                                  if (!isNaN(parseInt(cost))) {
                                      cost = Math.floor(parseInt(cost))
                                      const desc = await client.awaitReply(message, "Final step! What is the description for this role?")
                                      if (desc) {
                                          let newRoleData = {
                                              type: 'Role',
                                              price: cost,
                                              description: desc,
                                          }
                                          guild.createRole({name: name})
                                          .then(r => {
                                            newRoleData.id = r.id
                                            shopData.items[name] = newRoleData
                                            client.redisClient.set(guildKey, shopData)
                                            message.channel.send("Role successfully added to the shop!")  
                                          }).catch(err => message.channel.send("There seemed to be an error adding the role to the shop!"))
                                      } else {
                                         return message.channel.send("You failed to respond within 1 minute, or an error occurred!") 
                                      }
                                  } else {
                                        return message.channel.send("That isn't a number! Please restart this setup.") 
                                  }
                              } else {
                                    return message.channel.send("You failed to respond within 1 minute, or an error occurred!")
                              }
                          } else {
                                return message.channel.send("You failed to respond within 1 minute, or an error occurred!")
                          }
                       }
                    } else {
                       return message.channel.send("You failed to respond within 1 minute, or an error occurred!")
                    }
                }
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
