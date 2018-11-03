// clear messages

exports.run = (client, message, args, level) => {
    let num = parseInt(args[0])
    let deleted = 0
    var erasing = num

    let channel = message.channel
    if (!isNaN(num)) {
        let loopTimes = Math.max(Math.ceil(num / 100), 1)
        if (num > 1900) {
            return message.channel.send("Hey! Keep it wholesome, that's alot of messages! " + client.responseEmojis.scream)
        }
        var i;
        message.delete()
        for (i = 1; i <= loopTimes; i++) {
            if (num > 100) {
               erasing = 100
            }
            channel.fetchMessages({
                limit: erasing
            })
            .then(messages => {
            channel.bulkDelete(messages);
            deleted = deleted + erasing
            if (num == 1) {
                channel.send("*Swish.* 3 points!").then(message => message.delete(10000))
                // break
            }
            })
            .catch(err => {
                channel.send("Error deleting messages! I **don't have any permissions** or **these messages are too old!**")
                console.log(err)
                //break;
            })
        }
        if (deleted > 1) {
          channel.send(client.responseEmojis.wink + " Deleted " + deleted + " messages!").then(msg => msg.delete())
        }
        if (num > 1) {
            // message.channel.send("Just threw `" + Math.ceil(num) + "` messages in the garbage!").then(message => message.delete(10000))
        }
    } else {
        let random = Math.floor(Math.random() * 26)
        channel.send("Try sending a number? You know, like " + random + "?")
        return;
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["delete", "purge", "erase"],
    permLevel: "Moderator"
};

exports.help = {
    name: "clear",
    category: "Moderation",
    description: "Clears `x` amount of messages. Can't delete messages over 2 weeks old!",
    usage: "clear [num]"
};
