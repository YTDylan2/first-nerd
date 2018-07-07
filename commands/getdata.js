exports.run = (client, message, args, level) => {
    let enmap = require('enmap')
    let enmapLevel = require('enmap-level')
    let key = args[0]
    var gotValue = client.collection.get(key)
    message.channel.send(gotValue.toString() || "No data for this key.")
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "get",
    category: "Utility",
    description: "For data persistence testing.",
    usage: "get [arg] [val]"
};
