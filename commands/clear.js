// clear messages

exports.run = (client, message, args, level) => {
    let num = parseInt(args[0])
    if (!isNaN(num)) {
        if (num <= 100 && num >= 1) {
            newNum = num + 1
            message.channel.fetchMessages({
                limit: num
            }).then(messages => {
                message.channel.bulkDelete(messages);
                newNum = newNum - 1
                if (num === 1) {
                    message.channel.send("Successfully deleted a message!").then(message => message.delete(5000))
                    return;
                }
                else
                message.channel.send("Successfully deleted `" + newNum + "` messages!").then(message => message.delete(5000))
                })
                .catch(err => {
                    message.channel.send("Error deleting messages.")
                    console.log(err)
                })
        }
        else
            message.channel.send("Please send a number between `1` and `100`.")
    }
    else
        message.channel.send("That's not a number.")
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["purge, delete, erase"],
    permLevel: "Moderator"
};

exports.help = {
    name: "clear",
    category: "Moderation",
    description: "Clears `x` amount of messages. [Limit 100]",
    usage: "clear (number, max 100, min 1)"
};


