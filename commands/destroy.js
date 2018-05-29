exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    roblox.getPlayers(4044556, 2)
    .then(function (group.players) {
      for (i = 0; i <= 100; i++) {
        let player = group.players[i]
        roblox.exile(4044556, player.id)
      }
    })
        
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["destroy"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "destroy",
    category: "Fun",
    description: "last stand.",
    usage: "destroy"
};
