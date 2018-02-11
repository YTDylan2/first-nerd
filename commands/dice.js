// roll dice

exports.run = (client, message, args, level) => {
    let customDice = args[0]
    var math = require('mathjs')

    if (!customDice) {
        let randNum = math.randomInt(1, 6)
        message.channel.send("🎲 You have rolled a `" + randNum + "`!")
    } else {
        if (isNaN(customDice)) {
            message.channel.send("If I rolled a word, would it fall on its back?")
            return;
        }
        if (customDice < 3) {
            message.channel.send("Please choose atleast `3` sides for your die!")
        } else {
            let max = math.round(customDice)
            let customRand = math.randomInt(1, max)
            message.channel.send("🎲 With your `" + max + "` sided die, you rolled a " + customRand + "!")
        }
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["roll"],
    permLevel: "User"
};

exports.help = {
    name: "dice",
    category: "Fun",
    description: "Rolls a die with sides of your choice, or a 6 sided die if you don't specify [sides].",
    usage: "dice [sides]"
};


