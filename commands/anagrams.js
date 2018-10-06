function swap(chars, i, j) {
    var tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
}

function getAnagrams(input) {
    var counter = [],
        anagrams = [],
        chars = input.split(''),
        length = chars.length,
        i;

    for (i = 0; i < length; i++) {
        counter[i] = 0;
    }

    anagrams.push(input);
    i = 0;
    while (i < length) {
        if (counter[i] < i) {
            swap(chars, i % 2 === 1 ? counter[i] : 0, i);
            counter[i]++;
            i = 0;
            anagrams.push(chars.join(''));
        } else {
            counter[i] = 0;
            i++;
        }
    }

    return anagrams;
}

exports.run = async (client, message, args, level) => {
    let text = args.join(" ")
    if (text == undefined || text.length == 0) {
      return message.channel.send("Need a word!")
    }
    if (text.length > 6) {
      let difference = text.length - 6
      return message.channel.send("Too many characters. You're " + difference + " characters over the limit. (max 6)")
    }
    let combos = getAnagrams(text)
    combos = combos.join('\n,')
    client.hastebin(combos)
    .then(link =>{
      message.channel.send("Anagrams posted at " + link)
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["wordcombos"],
    permLevel: "User"
};

exports.help = {
    name: "anagrams",
    category: "Fun",
    description: "Gets all the possible ways a word / phrase can be re arranged!",
    usage: "anagrams [phrase]"
};
