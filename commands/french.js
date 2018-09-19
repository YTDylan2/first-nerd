// bonjour ;)

exports.run = (client, message, args, level) => {
    var translate = require('translate')
    let text = args.join(" ")
    let transKey = 'trnsl.1.1.20180211T004002Z.a79c5201f3d273a0.281b2e5318c73930291c2ab1760f4f83c731c575'
    if (!text) {
        message.channel.send("I need words!")
        return;
    }
    if (text.match("@everyone") || text.match("here")) {
        message.channel.send("I'm not that stupid! :(")
        return;
    }
    let translated = translate(text, { to: 'fr', engine: 'yandex', key: transKey }).then(function (newText) {
        if (newText == text) {
            message.channel.send("That's already french!")
        } else {
            message.channel.send(newText)
        }
    })
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["fr"],
    permLevel: "User"
};

exports.help = {
    name: "french",
    category: "Fun",
    description: "Bonjour!",
    usage: "french [text]"
};


