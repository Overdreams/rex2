const Discord = require("discord.js")
const fs = require("fs");
const config = require("./storage/config.json")
const bot = new Discord.Client();

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (error, files) =>{
    if(error) console.log(error)

    var jsFiles = files.filter(f => f.split(".").pop() === "js")
    if(jsFiles.length <= 0){
        console.log("Aucun fichier de comande ici !")
        return
    }
    jsFiles.forEach((f,i) =>{
        var getFile = require("./commands/" + f);
        console.log("Fichier de commande " + f + " trouvé !")
        bot.commands.set(getFile.help.name, getFile)
    })
});

bot.on("ready", async() =>{
    console.log(" ")
    console.log("Connecté en tant que " + bot.user.tag)
    bot.user.setActivity("!help | Rex", {type: "PLAYING"});
})

bot.on("message", message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    var prefix = config.prefix;
    var messageArray = message.content.split(" ");
    var command = messageArray[0];
    var args = messageArray.slice(1)
    var commands = bot.commands.get(command.slice(prefix.length))
    if(commands) commands.run(bot, message, args);
})

bot.login(config.token);

bot.on("guildMemberAdd", user =>{
    let joinEmbed = new Discord.RichEmbed()
        .setColor("#0630cb")
        .setAuthor(user.user.username, user.user.displayAvatarURL)
        .setDescription("Bienvenue à toi, **" + user.user.username + "**, sur notre fabuleux **" + user.guild.name + "** ! :wave: N'oublie pas de passer par le salon " + user.guild.channels.get("677919143047069726").name + " pour connaître tes droits et devoirs !")
        .setFooter("Serveur Ark | #bienvenue | @Rex")
    user.guild.channels.get("677906711113105442").send(joinEmbed)
    user.addRole("677912643578757167")
});

bot.on("guildMemberRemove", user =>{
    let leaveEmbed = new Discord.RichEmbed()
        .setColor("#d60e0a")
        .setAuthor(user.user.username, user.user.displayAvatarURL)
        .setDescription("Oh...**" + user.user.username + "** nous a quittés... :sleepy:")
        .setFooter("Serveur Ark | #bienvenue | @Rex")
    user.guild.channels.get("677906711113105442").send(leaveEmbed)
});
