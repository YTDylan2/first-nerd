// espanol?

exports.run = (client, message, args, level) => {
    const translate = require('translate')
    const request = require('request')
    let transKey = process.env.transKey
    
    translate.engine = 'yandex'
    translate.key = transKey
    let languages = {
       english: 'en',
       spanish: 'es',
       german:  'de',
       french: 'fr',
       chinese: 'zh',
       korean: 'ko',
       japanese: 'ja',
       russian: 'ru',
    }
    let list = []
    for (var i in languages) {
        let str = '`' + i + '`'
        list.push(str.toProperCase())
    }
    message.channel.send("Send the text you want to be translated!")
    const filter = m => m.author.id === message.author.id;
    message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ["time"]})
    .then(collected => {
        let text = collected.first().content
        message.channel.send("Please send the language you would like to convert this text in to!\n**Supported languages:**\n" + list.join("\n"))
        message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ["time"]})
        .then(collected => {
          let toLang = collected.first().content.toLowerCase()
         
          if (!languages[toLang]) {
              return message.channel.send("Please send a valid, supported language!")
          }
          message.channel.send("Alright, converting **" + text + "** to `" + toLang + "`... ")
          request.post('https://translate.yandex.net/api/v1.5/tr.json/detect?key=' + process.env.transKey + '&text=' + text, function(err, res, body) {
              if (err) {
                console.log(err)
                return message.channel.send("Error detecting your text's language.")   
              }
              console.log(body)
              let fromLang = body.lang
              translate(text, {from: fromLang, to: toLang}, function(response) {
                message.channel.send("Response:\n\n " + response)  
              })
          })
        })
    })
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["langauge"],
    permLevel: "User"
};

exports.help = {
    name: "translate",
    category: "Fun",
    description: "Translate text using Vanessa!\nInteractive setup!",
    usage: "translate <setup>"
};


