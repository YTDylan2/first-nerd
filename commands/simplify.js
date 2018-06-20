
// clear messages

exports.run = (client, message, args, level) => {
    var math = require('mathjs')
    let toSolve = args.join(" ")

    try {
        let solution = math.eval(toSolve).toString()
        message.channel.send(`The simplification is ${solution}.`)
    } catch (err) {
        message.channel.send("Please send a valid expression!")
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["homework"],
    permLevel: "User"
};

exports.help = {
    name: "simplify",
    category: "Fun",
    description: "Simplifies a math equation!",
    usage: "solve [..equation.. example: solve 12 + x * x]"
};
