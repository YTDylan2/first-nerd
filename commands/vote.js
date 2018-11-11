exports.run = async (client, message, args, level) => {
    message.channel.send(`Vote for me here! ${client.voterLink}\n\nBy voting, you get:\n**x2 or x3 Boxes At Once on the Box Game**\n**Access to >imagesearch**\n**Voter permissions level**`)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["upvote"],
    permLevel: "User"
};

exports.help = {
    name: "vote",
    category: "Info",
    description: "Gives you the link to upvote the bot!",
    usage: "vote"
};
