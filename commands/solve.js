// clear messages

exports.run = (client, message, args, level) => {
    var math = require('mathjs')
    let toSolve = message.content.slice("a!solve".length)

    try {
        let solution = math.eval(toSolve).toString()
        message.channel.send(`The solution is ${solution}.`)
    } catch (err) {
        message.channel.send("Please send a valid expression!")
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["math"],
    permLevel: "User"
};

exports.help = {
    name: "solve",
    category: "Fun",
    description: "Solves a math equation!",
    usage: "solve [..equation.. example: solve 12 + 1]"
};


