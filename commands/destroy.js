exports.run = (client, message, args, level) => {
    var roblox = require('roblox-js')
    var num = 0;
    setInterval(() => {
         roblox.getPlayers(4044556, 2)
        .then(function (group.players) {
            let player = group.players[num]
            roblox.exile(4044556, player.id)
            num = num + 1;
        })
    }, 200)
        
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
