const config = {
  // Bot Owner, level 999 by default. A User ID. Should never be anything else than the bot owner's ID.
  "ownerID": "240639333567168512",

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": [],

  // Your Bot's Token. Available on https://discordapp.com/developers/applications/me
  "token": "the token lmao",

  // our prefix
  "prefix" : ">",

  // my server
   "ownerGuild": '434477310817730572',

  // Default per-server settings. New guilds have these settings.


  "defaultSettings" : {
    "settings": {
      "prefix": ">",
      "welcomeChannel": "general",
      "welcomeMessage": "Hey there {user}! Welcome to the server!",
      "welcomeEnabled": "true",
      "welcomeAvatarPicture": "false",
      "botOwnerPerms" : "true"
    },
    "playerData" : {
      "leaderboards" : [

      ],
      "players" : {

      },
    },
    "data" : {
      "ignoredChannels" : {

      },
      "modRoles" : {

      },
      "adminRoles" : {

      },
      "superAdmins" : {

      },
      "disabledCommands" : {

      },
      "disabledCategories" : {

      },
      "commandPermissions" : {

      }
    }

  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 1,
      name: "User",

      check: () => true
    },
    { level: 2,
      name: "Voter",
      // Check if they have voted on the bot
      check: (message, client) => {
        return client.voters[message.author.id]
      }
    },


    { level: 3,
      // This is the name of the role.
      name: "Moderator",

      check: (message, client, data) => {
        try {
          let passed = false


            if (!data) return false;
              let modRoles = data.data.modRoles
              let memberRoles = message.member.roles
              let guildRoles = message.guild.roles
              for (x in modRoles) {
                if (memberRoles.has(x) || x == message.member.id) {
                  console.log("has role " + x)
                  passed = true
                  break
                }
              }




            return passed

        } catch (e) {
          return false;
        }
      }
    },

    { level: 4,
      name: "Administrator",
      check: (message, client, data) => {
        try {
          let passed = false


            if (!data) return false;
              let modRoles = data.data.adminRoles
              let memberRoles = message.member.roles
              let guildRoles = message.guild.roles
              for (x in modRoles) {
                if (memberRoles.has(x) || x == message.member.id) {
                  console.log("has role " + x)
                  passed = true
                  break
                }
              }
              // console.log(passed.length)



            return passed
        } catch (e) {
          return false;
        }
      }
    },

    { level: 4.5,
      name: "Super Administrator",
      check: (message, client, data) => {
        try {
          let passed = false


            if (!data) return false;
              let modRoles = data.data.superAdmins
              let memberRoles = message.member.roles
              let guildRoles = message.guild.roles
              for (x in modRoles) {
                if (memberRoles.has(x) || x == message.member.id) {
                  console.log("has role " + x)
                  passed = true
                  break
                }
              }
              // console.log(passed.length) nice copy pasta you noob



            return passed
        } catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    { level: 5,
      name: "Server Owner",
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => message.channel.type === "text" ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },

    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    { level: 8,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => config.support.includes(message.author.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    { level: 999,
      name: "Bot Owner",
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message, client, data) => {
        return message.client.config.ownerID === message.author.id && data.settings.botOwnerPerms == "true"
      }
    }
  ],

  boxData : {
    "Test" : {
      Price: 0,
      Color: '#ffffff',
      Chances: {
        Common: 80,
        Rare: 20,
      },
      Description: "A mysterious box only some can open.",
      Emoji: 'Test Box'
    }
  },

  defaultPlayerData : {
    coins: 1000,
    shards: 0,
    votePoints: 0,
    level: 1,
    xp: 0,
    sector: 'server', // Whether to display global or local
    inventory: {},
  },

  boxItems: {}

  setUpBoxItems: () => {
    let rarities = [
      {"Common", 0},
      {"Rare", 7500},
      {"Epic", 100000},
      {"Legendary", 750000},
      {"Mythic", 2500000},
    ]
    const fs = require('fs')
    let itemsJSONPath = './boxItems.json'
    fs.readFile(itemsJSONPath, 'utf8', function(err, data) {
      if (data) {
        let package = JSON.parse(data)
        let items = package.items
        for (x in items) {
          let item = items[x]
          if (item.price == -1) {
            item.price = 2500000
            item.value = 3500000
          }
          if (item.price == 0) {
            item.price = 500000
            item.value = 850000
          }
          for (num in rarities) {
            let rarity1 = rarities[num]
            let rarity2 = rarities[num + 1]
            if (!rarity2 && item.price >= rarity1[0]) {
              item.rarity = rarity1[0]
            } else {
              if (item.price <= rarity1[0]) {
                item.rarity = rarities[num - 1][0]
              }
            }
            if (item.price > rarity1[1] && item.price < rarity2[1]) {
              item.rarity = rarity1[0]
            }

          }
          // Set up rarity tables after items are set
          for (n in rarities) {
            let rarityData = rarities[n]
            for (x in items) {
              if (item.rarity == rarityData[0]) {
                if (!boxItems[item.rarity]) {
                  boxItems[item.rarity] = []
                }
                boxItems[item.rarity].push(item)
              }
            }
          }

          for (rarity in boxItems) {
            let data = boxItems[rarity]
            for (x in data) {
              console.log(rarity + " Tier loaded with " + data.length + " items!")
            }
          }
        }
      }
    })
  }
};

module.exports = config;
