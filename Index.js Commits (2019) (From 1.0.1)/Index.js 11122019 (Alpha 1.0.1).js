const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const db = require("megadb");
let warn_db = new db.crearDB("warns", "moderacion");
let logs_db = new db.crearDB("logs", "moderacion");
let prefix = 'rl!';

var queue = new Map();

client.on("ready", () => {
  console.log("Roler está listo para ser usado");
  client.user.setPresence({
    status: "online",
    game: {
      name: "rl!help, Alpha 1.0.1",
      type: "WATCHING"
    }
  });
});

async function play(message, serverQueue) {
  const args = message.content.split(" ");
  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel) return message.reply("debes entrar a un canal de voz");
  const permission = voiceChannel.permissionsFor(message.client.user);
  if (!permission.has("CONNECT") || !permission.has("SPEAK")) {
    return message.channel.send(
      "Necesito permisos para entrar al canal de voz"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(message.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      playSong(message.guilld, queueConstruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send("ha ocurrido un error al reproducir:" + err);
    }
  } else {
    serverQueue.songs(song);
    return message.channel.send(
      "la canción **{$song.title}** se ha añadido a la lista"
    );
  }
}

function playSong(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dipatcher = serverQueue.connection
    .playStram(ytdl(song.url))
    .on("end", () => {
      serverQueue.songs.shiift();
      playSong(guild, serverQueue.songs[0]);
    })
    .on("error", error => {
      console.log(error);
    });
  dipatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.on("message", async msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  const serverQueue = queue.get(msg.guild.id);
  if (!msg.guild) return;


  if (cmd == "ping") {
    let latencia = Math.floor(msg.client.ping);
    const embed = new Discord.RichEmbed()
      .setAuthor(`ping de ${msg.author.username}`)
      .setColor("RANDOM")
      .setTitle("Mira tu ping!")
      .setThumbnail(msg.author.displayAvatarURL)
      .addField("Pong!", ":ping_pong:" + latencia + "ms");
    msg.channel.send(embed);
  }

  if (cmd == "avatar") {
    let mencionado = msg.mentions.members.first() || msg.member;
    const embed = new Discord.RichEmbed()
      .setTitle(`Avatar pedido por: ${msg.author.username}`)
      .setFooter(`Avatar de: ${mencionado.user.username}`)
      .setColor("RANDOM")
      .setImage(mencionado.user.displayAvatarURL);
    msg.channel.send(embed);
  }

  if (cmd == "di") {
    let texto = args.join(" ");
    if (!texto) return msg.reply("Dime que es lo que quieres que diga **owo**");
    msg.delete();
    msg.channel.send(texto);
  }

  if (cmd == "roll") {
    let sh = 100;
    let latencia = Math.floor(Math.random() * (sh - 1 + 1)) + 1;
    const embed = new Discord.RichEmbed()
      .setAuthor(`Dados tirados por ${msg.author.username}...`)
      .setTitle("Los dados cayeron en...")
      .setColor("#B3B3B3")
      .addField("Los dados cayeron en...", + latencia);
    msg.channel.send(embed);
  }
  
  if (cmd === "help") {
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn.discordapp.com/attachments/474331584447643658/654103434567352321/juegos-de-rol-655x368_1.jpg")
    .setTitle(`Esta es la informacion y los comandos disponibles de Roler`) 
    .setColor("#B3B3B3")
    .addField("Versión del bot:", "Alpha 1.0.1")
    .addField("Repositorio:", "https://github.com/BloxOfficial/roler")
    .addField('rl!play', 'Reproduce una URL de YouTube')
    .addField('r!stop', 'Detiene la reproducción y sale del canal de voz')
     .addField("rl!di", "Roler repetirá lo que usted quiera que diga...")
    .addField("rl!roll", "Se lanzarán los dados y caera en una cantidad aleatoria entre el 1 a el 100");
    msg.channel.send(embed);
    }
  //invite...
if(cmd == "invite") {
  const embed = new Discord.RichEmbed()
  .setThumbnail("https://cdn.discordapp.com/attachments/474331584447643658/654103434567352321/juegos-de-rol-655x368_1.jpg")
  .setTitle(`Invita a RolerBot a tu servidor!`)
  .addField("Invita a RolerBot a tu servidor:", "https://discordapp.com/oauth2/authorize?client_id=654089433473089552&scope=bot&permissions=1207434689")
  msg.channel.send(embed);
  }
  
  if(cmd == "minecraft") {
    let respuestas = 3;
    let randomR = Math.floor(Math.random() * (respuestas + 1 -1)) + 1;
    const embed = new Discord.RichEmbed()
    .setTitle(`${msg.author.username} Está jugando Minecraft`)
    switch(randomR) {
        case 1: embed.setImage("https://thumbs.gfycat.com/ClassicBraveBeagle-small.gif"); break;
        case 2: embed.setImage("https://thumbs.gfycat.com/FatherlyUnsungHarpyeagle-size_restricted.gif"); break;
        case 3: embed.setImage("https://3.bp.blogspot.com/-uQcOUKFbvPs/XCWVAS5GNqI/AAAAAAAAETw/RGZ6wHwrJSswhK5feSDyztbfCt6ayVGlwCK4BGAYYCw/s1600/img3.gif"); break;
      }
        embed.setColor("#B3B3B3")
        msg.channel.send(embed);
    };
  
  if(cmd == "startmint") {
    let respuestas = 1;
    let randomR = Math.floor(Math.random() * (respuestas + 1 -1)) + 1;
    const embed = new Discord.RichEmbed()
    .setTitle(`${msg.author.username} Acaba de encender su PC con Linux Mint`)
    switch(randomR) {
        case 1: embed.setImage("https://cdn.pling.com/img/9/1/7/c/93cbd68c090416ae01c9a22565e36182ff7a.gif"); break;
      }
        embed.setColor("#00A304")
        msg.channel.send(embed);
    };
  
  if(cmd == "startwindows7") {
    let respuestas = 2;
    let randomR = Math.floor(Math.random() * (respuestas + 1 -1)) + 1;
    const embed = new Discord.RichEmbed()
    .setTitle(`${msg.author.username} Acaba de encender su PC con Windows 7`)
    switch(randomR) {
        case 1: embed.setImage("https://thumbs.gfycat.com/CarefreePinkDragonfly-size_restricted.gif"); break;
      }
        embed.setColor("#008FCF")
        msg.channel.send(embed);
    };
  
  if(cmd == "kali") {
    let respuestas = 1;
    let randomR = Math.floor(Math.random() * (respuestas + 1 -1)) + 1;
    const embed = new Discord.RichEmbed()
    .setTitle(`${msg.author.username} Está usando su PC con Kali Linux, preparense para morir...`)
    switch(randomR) {
      case 1: embed.setImage("https://1.bp.blogspot.com/-JS_VqagUTFU/Xd6Ac3wIZcI/AAAAAAAABdI/edAtiowc6rMeoMK-OnM37ogrZakpReP4ACPcBGAYYCw/s640/kali.gif"); break; 
    }
        embed.setColor("#008FCF")
        msg.channel.send(embed); //no hace falta el switch si es solo una respuesta; asi esta bien, xdxdxd; ok xd;
    };

  if(cmd == "credits") {
    const embed = new Discord.RichEmbed()
    .setTitle('Creditos')
    .setDescription('Muchas gracias por el apoyo brindado en el desarrollo de Roler, de verdad, muchas gracias...')
    .addField("Desarrollo del bot:", "Blox#5019, GatoLandia#6354")
    .addField("Diseño del bot:", "Blox#5019")
    .addField("Invita a el bot de mi compañero GatoLandia#6354:", "https://discordapp.com/api/oauth2/authorize?client_id=646202049926791180&permissions=8&scope=bot")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
}

  if(cmd === "ctof") {
    let celsius = args.join(" ");
    if(!celsius) return msg.channel.send('Debes ingresar el valor en C°');
    let fahrenheit = celsius * 1.8 + 32;
    const embed = new Discord.RichEmbed()
    .setTitle('Conversión de Celsius a Fahrenheit')
    .addField('Celsius:', 'C° ' + celsius )
    .addField('Fahrenheit:', 'F° ' + fahrenheit)
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  if(cmd == 'userinfo') {
    let estados = {
        "online": "Conectado",
        "offline": "Desconectado",
        "idle": "Ausente",
        "dnd": "No molestar..."

    }
    let mencionado = msg.mentions.members.first() || msg.member;
    const embed = new Discord.RichEmbed()
    embed.setDescription(`informaciòn de el usuario ${mencionado.user.username}`)
    embed.setThumbnail(mencionado.user.displayAvatarURL)
    embed.setColor("#B3B3B3")
    embed.addField("tag y nombre", `${mencionado.user.tag}`)
    embed.addField("Entro en", mencionado.joinedAt.toDateString(), true)
    embed.addField("ID", `${mencionado.id}`)
    embed.addField("Estado", `${estados[mencionado.presence.status]}`)
    embed.addField("roles de el usuario", `${mencionado.roles.map(m => m).join("**-**")}`)
    msg.channel.send(embed);
    };
  
  if(cmd === "ftoc") {
    let fahrenheit = args.join(" ");
    let almostCelsius = fahrenheit - 32;
    let celsius = almostCelsius / 1.8; 
    if(!fahrenheit) return msg.channel.send('Debes ingresar el valor en F°');
    const embed = new Discord.RichEmbed()
    .setTitle('Conversión de Fahrenheit a Celsius')
    .addField('Fahrenheit:', 'F° ' + fahrenheit)
    .addField('Celsius:', 'C° ' + celsius )
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
});

 client.login(process.env.token);
