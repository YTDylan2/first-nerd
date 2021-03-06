// ban user

exports.run = (client, message, args, level) => {
   var discord = require("discord.js")
   var allowedUsers = client.redisClient.get("Roadmap Allowed")
   var prefix = client.config.prefix

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

   function spaceOut(str) {
      let matching = '-'
      let final = str
      while (final.match(matching)) {
         final = final.replace(matching, " ")
         console.log(final.match(matching))
      }
      return final
   }

   function isCommand(str) {
      if (!str == "help" && !str == "addtopic" && !str == "deltopic" && !str == "addplan" && !str == "delplan") {
         return true
      } else {
         return false
      }
   }

   client.redisClient.get("Roadmap", function(err, roadmapData) {
      if (roadmapData) {
         var data = JSON.parse(roadmapData)
         var scope = args[0]
         var fullString = args.join(" ")
         var command = args[1]

         if (command && scope == 'config') {
            if (level == 10 || allowedUsers[message.author.id]) {
               let cmdArgs = getArgsPastIndex(1, args)
               if (command == "help") {
                   const embed = new discord.RichEmbed()
                  .setTitle("Command help")
                  .addField("addtopic", `Add a new topic / scope!\nUsage: ${prefix}roadmap config addtopic [topic-name]\n!! NOTE: Spaces are marked with a **-** between letters.`)
                  .addField("deltopic", `Deletes a topic / scope.\nUsage: ${prefix}roadpmap config deletetopic [topic-name]\n!! NOTE: Spaces are marked with a **-** between letters.`)
                  .addField("addplan", `Adds a plan to a topic.\nUsage: ${prefix}roadmpaddplan [topic-name] [plan]\!! NOTE: Spaces are marked with a **-** between letters. **This is not required for adding plans.**`)
                  .addField("delplan", `Deletes a plan from a topic.\nUsage: ${prefix}delplan [topic-name] [plan number (1, 2, etc)]\!! NOTE: Spaces are marked with a **-** between letters. **This is not required for adding plans.**`)
                  .addField("help", "Displays help!")
                  .setColor(6579455)
                  message.channel.send({embed})
               }
               if (command == "addtopic") {
                  let modified = data
                  let name = cmdArgs[1]
                  name = spaceOut(name)
                  if (modified[name]) {
                     message.channel.send("That topic exists already!")
                     return;
                  } else {
                     modified[name] = []
                     client.redisClient.set("Roadmap", JSON.stringify(modified))
                     message.channel.send("Created topic **" + name + ".** ✅")
                  }
               }
               if (command == "deltopic") {
                  let modified = data
                  let name = cmdArgs[1]
                  name = spaceOut(name)
                  if (!modified[name]) {
                     message.channel.send("That topic does not exist!")
                     return;
                  } else {
                     delete modified[name]
                     client.redisClient.set("Roadmap", JSON.stringify(modified))
                     message.channel.send("Deleted topic **" + name + ".** ✅")
                  }
               }
               if (command == "addplan") {
                  let modified = data
                  let name = cmdArgs[1]
                  name = spaceOut(name)
                  let plan = getArgsPastIndex(2, cmdArgs).join(" ")
                  if (!modified[name]) {
                     message.channel.send("Topic does not exist!")
                      return;
                  } else {
                     modified[name].push(plan)
                     client.redisClient.set("Roadmap", JSON.stringify(modified))
                     message.channel.send("Added plan to topic **" + name + ".** ✅")
                  }
               }
               if (command == "delplan") {
                  let modified = data
                  let name = cmdArgs[1]
                  name = spaceOut(name)
                  let num = cmdArgs[2] - 1
                  if (!modified[name]) {
                     message.channel.send("Topic does not exist!")
                      return;
                  } else {
                     modified[name].splice(num, 1)
                     client.redisClient.set("Roadmap", JSON.stringify(modified))
                     message.channel.send(`Deleted plan **#${num + 1}** from topic **${name}.** ✅`)
                  }
               }
            } else {
               message.channel.send("access denied!")
            }
            return
         }
         if (scope) {

            let plans = data[fullString]
            if (plans) {
               let str = ""
               for (var i in plans) {
                   if (typeof(plans[i]) == 'string') {
                     let num = i + 1
                     str = str + ( parseInt(num) + ". " + plans[i] + '\n')
                   }
               }
               const embed = new discord.RichEmbed()
               .setTitle("Roadmap for **" + fullString + "**")
               .setColor(6579455)
               if (str.length > 0) {
                  embed.addField("Plans", str)
               } else {
                  embed.addField("Plans", "Nothing here yet...")
               }
               message.channel.send({embed})
            } else {
               message.channel.send("No plans for this topic!")
            }
         } else {
            if (!scope) {
              message.channel.send("Please provide a scope / roadmap topic! Here, I'll fetch some!")
               let scopes = [];
               let i;
               for (i in data) {
                  scopes.push(`**${i}**`)
               }
               let str = scopes.join("\n")
                const embed = new discord.RichEmbed()

               .setColor(6579455)
               if (scopes.length > 0 && str.length > 0) {
                  embed.addField("Scopes and topics\n\n", str)
               } else {
                  embed.addField("Scopes and topics\n\n", "None")
               }
               message.channel.send({embed})

            }
         }
      }
   })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "roadmap",
    category: "Personal",
    description: "this command does not do anything",
    usage: "roadmap"
};
