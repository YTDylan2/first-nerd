exports.run = async (client, message, args, level) => {
    message.channel.send("this command does nothing yet.")
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "User"
};

exports.help = {
    name: "begin",
    category: "WIP Commands",
    description: "Begin your journey here!",
    usage: "begin"
};
