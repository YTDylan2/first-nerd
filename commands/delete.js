// clear messages

exports.run = (client, message, args, level) => {
    let num = parseInt(args[0])
    var erasing = num
    if (!isNaN(num)) {
        let loopTimes = Math.max(Math.ceil(num / 100), 1)
        
        var i;
        for (i = 1; i <= loopTimes; i++) {  
            if (num > 100) {
               erasing = 100
            }
            message.channel.fetchMessages({
                limit: erasing
            })
            .then(messages => {
            message.channel.bulkDelete(messages);
            if (num == 1) {
                message.channel.send("*Swish.* 3 points!").then(message => message.delete(10000))   
                break
            }        
            })
            .catch(err => {
                message.channel.send("Error deleting messages! I **don't have any permissions** or **these messages are too old!**")
                console.log(err)
                break;
            })
        }
        if (num > 1) {
            // message.channel.send("Just threw `" + Math.ceil(num) + "` messages in the garbage!").then(message => message.delete(10000))
        }
    } else {
        let random = Math.floor(Math.random() * 26)
        message.channel.send("Try sending a number? You know, like " + random + "?")
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
    description: "Clears `x` amount of messages. Can't delete messages over 2 weeks old!\n**Warning: Any user with Manage Messages can use this command. This will be fixed in the future.**",
    usage: "clear [num]"
};


