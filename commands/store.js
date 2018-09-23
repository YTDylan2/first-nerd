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
    embed.setTitle(settings.name)
    embed.setDescription(settings.description)
    for (var x in items) {
        let item = items[x]
        let price = item.price
        let desc = item.description
        embed.addField(x, `**Cost: ${price} coins**\n${desc}`)
    }
    embed.setFooter("jesse has the ultra fats", client.user.avatarURL)
    embed.setColor(process.env.green)
    embed.setTimestamp()
    channel.send({embed})
}
        

exports.run = (client, message, args, level) => {
    let guild = message.guild
    client.redisClient.get(guild.id + '-SHOPTEST', function(err, response) {
        if (response) {
            let shopData = JSON.parse(response)
            let action = args[0]
            if (!action) {
                shopToEmbed(shopData, message.channel, client)
                return
            }
        } else {
            let def = {
                'items': {
                    'testitem' : {
                       price: 100,
                       description : 'it smells like vinegar'
                    },
                    'testitem2' : {
                        price: 200,
                        description: 'you should not eat this! its toxic'
                    }
                },
                'settings' : {
                    name: guild.name + "'s Shop",
                    description: 'a place where you buy thingies for your shmingies',
                    icon : ''
                }
            }
            client.redisClient.set(guild.id + '-SHOPTEST', JSON.stringify(def), function(err, response) {              
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