exports.run = async (client, message, args, level) => {
    let voted = await client.botlistclient.hasVoted(message.author.id)
    if (!voted) {
      return message.channel.send("You haven't voted! If you want to vote, run the `>support` command\nIf you just recently voted, please wait up to 3 minutes for it to register.\nVotes expire after 12 hours, so make sure to check!")
    } else {
      return message.channel.send("You've voted me up! Please remember all votes last for 12 hours.")
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["votecheck"],
    permLevel: "User"
};

exports.help = {
    name: "checkvote",
    category: "Info",
    description: "Returns if you've voted or not.",
    usage: "checkvote"
};
