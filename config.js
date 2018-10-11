const config = {
  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  "ownerID": "240639333567168512",

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [],

  // Bot Support, level 8 by default. Array of user ID strings
  "support": [],

  // Your Bot's Token. Available on https://discordapp.com/developers/applications/me
  "token": ":)",

  // our prefix
  "prefix" : ">",

  // my server
   "ownerGuild": '434477310817730572',

  // Default per-server settings. New guilds have these settings.

  // DO NOT LEAVE ANY OF THESE BLANK, AS YOU WILL NOT BE ABLE TO UPDATE THEM
  // VIA COMMANDS IN THE GUILD.

  "defaultSettings" : {
    "settings": {


      "prefix": ">",
      "welcomeChannel": "general",
      "welcomeMessage": "Hey there {user}! Welcome to the server!",
      "welcomeEnabled": "true",
      "workEarnMin" : 25,
      "workEarnMax" : 150,
      "workEarnCooldown" : 5,
      "workEarnDaily" : 500,
      "crimeMultiplier" : 1.5,
      "crimeDeductionPercent" : 2.5,
      "crimeWinRate" : 50
    },
    "economy" : {
      "leaderboards" : {

      },
      "players" : {

      },
      "shopData" : {

      }
    },
    "data" : {
      "ignoredChannels" : {

      },
      "modRoles" : {

      },
      "adminRoles" : {

      },
      "disabledCommands" : {

      },
      "disabledCategories" :{

      }
    }

  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: "User",
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 2,
      // This is the name of the role.
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: async (message, client) => {
        try {
          var passed = false
          let response = await client.getGuildData(message.guild)
            let data = JSON.parse(response)
            if (!data) return falss;
              let modRoles = data.data.modRoles
              let memberRoles = message.member.roles
              let guildRoles = message.guild.roles
              for (x in modRoles) {
                if (memberRoles.has(x)) {
                  console.log("has role " + x)
                  passed = true
                  
                  // break
                }
              }
            if (modRoles[message.member.id]) {
              passed = true
              
            } else {
              console.log("no special id")
            }

          
          return passed
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Admin",
      check: async (message, client) => {
        try {
          var passed = false
          let response = await client.getGuildData(message.guild)
            let data = JSON.parse(response)
            if (data) return false;
              let adminRoles = data.data.adminRoles
              let memberRoles = message.member.roles
              let guildRoles = message.guild.roles
              for (x in adminRoles) {
                if (memberRoles.has(x)) {
                  console.log("has role " + x)
                  passed = true
                  
                }
              }
              if (adminRoles[message.member.id]) {
                passed = true
                
              } else {
                console.log("no special id")
              }
          
          
            return passed
        } catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    { level: 4,
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
    { level: 10,
      name: "Bot Owner",
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
