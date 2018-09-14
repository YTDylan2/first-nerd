// ban user

exports.run = (client, message, args, level) => {
   client.redisClient.get("Roadmap", function(err, roadmapData) {
      if (roadmapData) {
        console.log(level)
      }
    }
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [""],
    permLevel: "User"
};

exports.help = {
    name: "roadmap",
    category: "System",
    description: "Shows any planned updates.",
    usage: "roadmap"
};
