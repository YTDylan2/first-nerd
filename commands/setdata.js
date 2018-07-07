exports.run = (client, message, args, level) => {
    let enmap = require('enmap')
    let enmapLevel = require('enmap-level')
    let key = args[0]
    let val = args[1]
    client.collection.set(key, val)
    var gotValue = client.collection.get(key)
    message.channel.send(gotValue.toString() + " was set to the key " + key || "No data for this key.")
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "set",
    category: "Utility",
    description: "For data persistence testing.",
    usage: "set [arg] [val]"
};
