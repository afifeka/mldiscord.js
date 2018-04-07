const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const cpu = process.cpuUsage().system / 1024 / 1024;
const used = process.memoryUsage().heapUsed / 1024 / 1024;
const ms = require("ms");
const YTDL = require("ytdl-core");

const bot = new Discord.Client({disableEveryone: false});

var servers = {}

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection, message);
    else connection.disconnect();
  })
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);

  
});

bot.on('guildMemberAdd', member => {

 
  const channel = member.guild.channels.find('name', '🔝selamat-datang');
  
  if (!channel) return;
  
  message.channel.send(`**Welcome! ${message.author.tag}, Dont Forget To Look The Rules!**`)
});

bot.on('guildMemberRemove', member => {
 
  const channel = member.guild.channels.find('name', '🔚selamat-tinggal');
  
  if (!channel) return;
  
  channel.send(`Goodbye! ${message.author.tag} Dead In Here :,(! `);
});


bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  
  
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  var args = message.content.substring(prefix.length).split(" ");
  //let args = messageArray.slice(1);

  if(cmd === `${prefix}kick`){

    //!kick @daeshan askin for it

    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send(":warning: **| Please Tag Player To Be Kicked!**");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":negative_squared_cross_mark: **| You Dont Have Permission To Do This!**");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":negative_squared_cross_mark: **| Failed To Kicked This Person!**");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("**KICKED**")
    .setColor("#f80a0a")
    .addField(":bust_in_silhouette: | Player Kicked", `**${kUser} | ID ${kUser.id}**`)
    .addField(":bust_in_silhouette: | Kicked By", `**<@${message.author.id}> | ID ${message.author.id}**`)
    .addField(":no_entry: | Reason", kReason);

    let kickChannel = message.guild.channels.find(`name`, "mod-log");
    if(!kickChannel) return message.channel.send("No Named Channel `mod-log`.");

    message.guild.member(kUser).kick(kReason);
    
    message.delete().catch(O_o=>{});
    message.channel.send(":white_check_mark:  | **Succes Kicked Players**")
    kickChannel.send(kickEmbed);

    return;
  }
 
  if(cmd === `${prefix}purge`){
    message.delete()
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, you don't have a permissions to do this!");
    if(!args[1]) return message.channel.send("Please Give The Number");
    message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(`🗑 | ${message.author} Succed Cleared ${args[0]} messages.`).then(msg => msg.delete(args[1]));

      let bicon = bot.user.displayAvatarURL;
      let purgemod = new Discord.RichEmbed()
      .setAuthor("Log | Purge", `https://images-ext-1.discordapp.net/external/fthmtHB4VcjVNH0P_yelzxnIj208kreL34GdDZOwxBU/https/qph.ec.quoracdn.net/main-qimg-83c6de25ed91d13a4f09fb5f11ca8853`)
      .setColor("#414c56")
      .addField("Executor:", `${message.author}`, true)
      .addField("Purge:", `${args[0]}`, true)
      .setFooter("WARNING!: This bot it still on beta testing. If you have any issue or suggestion please dm Afif");

      let modlog = message.guild.channels.find(`name`, "mod-log");
      if(!modlog) return message.channel.send("Can't Find mod-log channel.");

      modlog.send(purgemod);


    })
  }
	
	
  
  
  if (cmd === `${prefix}verify`) {
     
      let role = message.guild.roles.find(r => r.name === "ENERGY");
      message.member.addRole(role)
    
      if(message.member.roles.has(role.id)) return message.reply("You already have ENERGY roles!");

      let acceptlaporan = new Discord.RichEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL)
      .setColor(3447003)
      .setDescription(`${message.author.tag} Has Been Verified`)
      .setFooter("Ikan | Beta v2.0")

      let modlog = message.guild.channels.find(`name`, "mod-log");
      if(!modlog) return message.channel.send("Cant Find mod-log Channel.");

      modlog.send(acceptlaporan);
      message.react("✅");

    }

  if(cmd === `${prefix}ban`){

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send(":warning: **| Please Tag Player To Be Banned!**");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("No can do pal!");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":negative_squared_cross_mark: **| Failed To Banned This Person!**");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("**BANNED**")
    .setColor("#f80a0a")
    .addField(":bust_in_silhouette: | Player Banned", `**${bUser} | ID ${bUser.id}**`)
    .addField(":bust_in_silhouette: | Banned By", `**<@${message.author.id}> | ID ${message.author.id}**`)
    .addField(":no_entry: | Reason", bReason);


    let modlogchannel = message.guild.channels.find(`name`, "mod-log");
    if(!modlogchannel) return message.channel.send("No Named Channel `mod-log`.");

    message.guild.member(bUser).ban(bReason);
    
    message.delete().catch(O_o=>{});
    message.channel.send(":white_check_mark:  | **Succes Banned Players**")
    modlogchannel.send(banEmbed);


    return;
  }
  
  
  if (cmd === `${prefix}stats`){
    let uptimes = (Math.round(bot.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds.\n"

    let testembed = new Discord.RichEmbed()
    .setDescription("**STATS**")
    .setColor("#00fa3d")
    .addField(":mag: | Total Server", `${bot.guilds.size} Servers!`)
    .addField(":satellite: | Total Channels", `${bot.channels.size} Channels!`)
    .addField(":busts_in_silhouette: | Total Users", `${bot.users.size.toLocaleString()} Users!`)
    .addField(":notebook_with_decorative_cover: | Library", "Discord.js")
    .addField(":bulb: | CPU Usage", `${Math.round(cpu * 100) / 100}%`, true)
    .addField(":clipboard: |\ Memory Usage", `${Math.round(used * 100) / 100} MB`)
    .addField(":hourglass_flowing_sand: | Uptime", uptimes)
    .setFooter("This Command Has Released")

    message.channel.send(testembed);
  }
  

  if(cmd === `${prefix}addrole`){
    if (!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
    if (args[0] == "help") {
      message.reply(":warning: | \nUsage: !addrole [user] [role]");
      return;
    }
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!rMember) return errors.cantfindUser(message.channel);
    let role = args.join(" ").slice(22);
    if (!role) return message.reply(":bust_in_silhouette: | Specify a role!");
    let gRole = message.guild.roles.find(`name`, role);
    if (!gRole) return message.reply(":bust_in_silhouette: | Roles Not Found!");
  
    if (rMember.roles.has(gRole.id)) return message.reply("✅ | They Hlready Have That Role!");
    await (rMember.addRole(gRole.id));
  
    try {
      await rMember.send(`Congrats, You Have Been Given The Role ${gRole.name}`)
    } catch (e) {
      console.log(e.stack);
      message.channel.send(`:tada: | Congrats To <@${rMember.id}>, They Have Been Given The Role ${gRole.name}`)
    }
  }
  
  if(cmd === `${prefix}removerole`){
    if (!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
    if(args[0] == "help"){
      message.reply(":warning: | Usage: !removerole <user> <role>");
      return;
    }
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rMember) return message.reply(":warning: | Couldn't Find That User, To.");
    let role = args.join(" ").slice(22);
    if(!role) return message.reply(":bust_in_silhouette: | Specify a role");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply(":bust_in_silhouette: | Roles Not Found!");
  
    if(!rMember.roles.has(gRole.id)) return message.reply(":warning: | They Don't Have That Role!");
    await(rMember.removeRole(gRole.id));
  
    try{
      await rMember.send(`RIP, You Lost The ${gRole.name} Role!`)
    }catch(e){
      message.channel.send(`RIP To <@${rMember.id}>`)
    }
  }
  
  if(cmd === `${prefix}ikan`){
    if(!args[2]) return message.reply("**Usage `!ikan <Question>`**");
    let replies = ["Yes", "No", "I Dont Know!", "Apa Yang Kamu Bilang?", "Sangat Benar", "Sangat Salah"];

    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(1).join(" ");

    let ballembed = new Discord.RichEmbed()
    .setColor("#8d09f1")
    .addField(":question: | Question", question)
    .addField(":envelope_with_arrow: | Answer", replies[result])
    .setFooter(`Question By ${message.author.tag}`);

    message.channel.send(ballembed)

  }
  
  if(cmd === `${prefix}userinfo`){
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    let embed = new Discord.RichEmbed()
    .setDescription("**USER INFO**")
    .setColor("#00a6ff")
    .setImage(member.user.displayAvatarURL)
    .addField(":bust_in_silhouette: | Player", `${member.user.tag}`)
    .addField(":shield: | ID", member.id)
    .addField(":hammer: | Created", member.user.createdAt)
    .addField(":inbox_tray: | Joined", member.joinedAt);

    message.channel.send(embed);
    return;
  }


  if(cmd === `${prefix}report`){

    //!report @ned this is the reason

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send(":warning: **| Please Tag Player To Be Report!**");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("**REPORTS**")
    .setColor("#f3d804")
    .addField(":bust_in_silhouette: **| Player**", `**${rUser} | ID: ${rUser.id}**`)
    .addField(":mag: **| Reason**", rreason)
    .setFooter("Beta v0.2 | Discord.js");

    let reportschannel = message.guild.channels.find(`name`, "mod-log");
    if(!reportschannel) return message.channel.send("No Named Channel `mod-log`.");


    message.delete().catch(O_o=>{});
    message.channel.send(":white_check_mark: **| Success Reported The Player!**")
    reportschannel.send(reportEmbed);

    return;
  }


  if(cmd === `${prefix}say`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    const sayMessage = message.content.split(" ").slice(1).join(" ");
    message.delete().catch();
    message.channel.send(sayMessage);
  }


  if(cmd === `${prefix}afk`){
    let afkuser = args[1].slice(0);

    message.delete()
    message.guild.members.get(message.author.id).setNickname("AFK |" + message.author.username);
    message.channel.send("**:bust_in_silhouette: | User Has Afk »** " + `${message.author} ` + `**» ${afkuser}**`)

     return;
  }


  if(cmd === `${prefix}ping`){
    let pingembed = new Discord.RichEmbed()
    .setDescription("**Information!**")
    .setColor("#ffc700")
    .addField("**Your Ping!**", + message.client.ping)
    return message.channel.send(pingembed);
  }

  if (cmd === `${prefix}warn`){
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("No can do pal!");
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.reply("Couldn't find them yo");
    if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They waaaay too kewl");
    let reason = args.join(" ").slice(22);
  
    if(!warns[wUser.id]) warns[wUser.id] = {
      warns: 0
    };
  
    warns[wUser.id].warns++;
  
    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
      if (err) console.log(err)
    });
  
    let warnEmbed = new Discord.RichEmbed()
    .setDescription("Warns")
    .setAuthor(message.author.username)
    .setColor("#fc6400")
    .addField("Warned User", `<@${wUser.id}>`)
    .addField("Warned In", message.channel)
    .addField("Number of Warnings", warns[wUser.id].warns)
    .addField("Reason", reason);
  
    let warnchannel = message.guild.channels.find(`name`, "incidents");
    if(!warnchannel) return message.reply("Couldn't find channel");
  
    warnchannel.send(warnEmbed);
  
    if(warns[wUser.id].warns == 2){
      let muterole = message.guild.roles.find(`name`, "muted");
      if(!muterole) return message.reply("You should create that role dude.");
  
      let mutetime = "10s";
      await(wUser.addRole(muterole.id));
      message.channel.send(`<@${wUser.id}> has been temporarily muted`);
  
      setTimeout(function(){
        wUser.removeRole(muterole.id)
        message.reply(`<@${wUser.id}> has been unmuted.`)
      }, ms(mutetime))
    }
    if(warns[wUser.id].warns == 3){
      message.guild.member(wUser).ban(reason);
      message.reply(`<@${wUser.id}> has been banned.`)
    }
  
  }
  
  
  
  if(cmd === `${prefix}tempmute`){
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply(":bust_in_silhouette: | No Player Wants You Mute!");
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply(":negative_squared_cross_mark: | Cant Mute Them!");
    let muterole = message.guild.roles.find(`name`, "muted");
    //start of create role
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    //end of create role
    let mutetime = args[1];
    if(!mutetime) return message.reply("You didn't specify a time!");
  
    await(tomute.addRole(muterole.id));
    message.reply(`:white_check_mark: | <@${tomute.id}> Has Been Muted For ${ms(ms(mutetime))}`);
  
    setTimeout(function(){
      tomute.removeRole(muterole.id);
      message.channel.send(`:hourglass_flowing_sand: | <@${tomute.id}> Has Been Unmuted!`);
    }, ms(mutetime));
  }
  
   if (cmd === `${prefix}play`){
    if (!args[1]) {
      message.channel.send("💿 **| Plase Give Link On Youtube Music!**")
      return;
    }

    if (!message.member.voiceChannel) {
      message.channel.send("💿 **| Plase Join A Voice Channel!**")
      return;
    }

    if (!servers[message.guild.id]) servers[message.guild.id] = {
      queue: []
    };

    var server = servers[message.guild.id];

    server.queue.push(args[1]);

    if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
      play(connection, message)
      message.delete().catch(O_o=>{});
      message.channel.send(`💿 **| Now Playing ${args[1]} !**`);
    });
  }

  if (cmd === `${prefix}skip`) {
    var server = servers[message.guild.id];

    if (server.dispatcher) server.dispatcher.end();
    message.channel.send("💿 **| Music Has Skipped!**")
    return; 
  }

 if(cmd === `${prefix}stop`){
    var server = servers[message.guild.id];

    if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
    message.channel.send("💿 **| Music Has Stopped!**")
   return; 
  }
  
  
  
  if(cmd === `${prefix}reload`){
        var embedNoWork = new Discord.RichEmbed()
    .setTitle("Restricted")
    .setColor("#f45f42")
    .addField("You are restricted from this command", "Its for the bot owners only!")
    
    var authors = ["331616752767205378"];
    if(!authors.includes(message.author.id)) {
    message.channel.send({embed: embedNoWork});
    }
    
    const term = require( 'terminal-kit' ).terminal ;

    if (!args || args.length < 1) return message.channel.send("Must provide a command name to reload!");

    delete require.cache[require.resolve(`./${args[0]}.js`)];
    message.channel.send("Succesfully reloaded " + `${args[0]}`)

    let progressBar , progress = 0 ;

    function doProgress()
    {
    progress += Math.random() / 10 ;
    progressBar.update( progress ) ; 

    if ( progress >= 1 )
    {
    console.log(`The command ${args[0]} has been reloaded`)
    }
    else
    {
      setTimeout( doProgress , 100 + Math.random() * 400 ) ;
    }
  }


  progressBar = term.progressBar({
    width: 80 ,    eta: true ,
    percent: true
  });
  doProgress();
}
  
  if(cmd === `${prefix}tableflip`){
	message.channel.send("(°-°)\\ ┬─┬").then(m => {
        setTimeout(() => {
            m.edit("(╯°□°)╯    ]").then(ms => {
                setTimeout(() => {
                    ms.edit("(╯°□°)╯  ︵  ┻━┻")
                }, 250)
            })
        }, 250);

    });
    
}


});
  
  

bot.login(process.env.BOT_TOKEN);
