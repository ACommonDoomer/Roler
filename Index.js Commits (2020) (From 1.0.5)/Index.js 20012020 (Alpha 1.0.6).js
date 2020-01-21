//ANTES QUE NADA, LOS COMANDOS Y SU CONTENIDO ESTARÁ EN ESPAÑOL/BEFORE ANYTHING, THE COMMANDS AND THEIR CONTENT WILL BE IN SPANISH.
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const db = require("megadb");
const config = require("./config.json");
console.log("Esta es una version alpha <3, Disfruta la nueva Alpha 1.0.6");
let prefix = config.prefix;

var queue = new Map();
var recuerdos = new Map();

client.on("ready", () => {
  console.log("Roler está listo para ser usado");
  client.user.setPresence({
    status: "online",
    game: {
      name: "rl!help, Alpha 1.0.6",
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

  //Old Update (Alpha 1.0.1)

  if (cmd == "ping") {
    let latencia = Math.floor(msg.client.ping);
    const embed = new Discord.RichEmbed()
      .setAuthor(`ping de ${msg.author.username}`)
      .setColor("#B3B3B3")
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
      .setColor("#B3B3B3")
      .setImage(mencionado.user.displayAvatarURL);
    msg.channel.send(embed);
  }

  if (cmd == "say") {
    let texto = args.join(" ");
    if (!texto) return msg.reply("Dime que es lo que quieres que diga **owo**");
    msg.delete();
    msg.channel.send(texto);
  }

  if (cmd == "roll") {
    let sh = 100;
    let latencia = Math.floor(Math.random() * (sh - 1 + 1)) + 1;
    function roll() {
    const embed = new Discord.RichEmbed()
      .setAuthor(`Dados tirados por ${msg.author.username}...`)
      .setTitle("Los dados cayeron en...")
      .setColor("#B3B3B3")
      .addField("Los dados cayeron en...", + latencia);
      msg.channel.send(embed);
  }
      msg.channel.send('Mezclando...');
      
      setTimeout(roll, 2000);
} 
  
  if (cmd === "help") {
    const embed = new Discord.RichEmbed()
    .setTitle(`Felices fiestas navideñas!, Esta es la informacion y los comandos disponibles de Roler`) 
    .setColor("#B3B3B3")
    .setThumbnail("https://cdn.discordapp.com/attachments/474331584447643658/654103434567352321/juegos-de-rol-655x368_1.jpg")
    .addField("Versión actual del bot:", "Alpha 1.0.6")
    .addField("Repositorio:", "https://github.com/BloxOfficial/roler")
    .addField("Página web oficial:", "https://rolerdev.glitch.me")
    .addField("Old Update", "Alpha 1.0.1")
    .addField('rl!play', 'Reproduce una URL de YouTube')
    .addField('rl!stop', 'Detiene la reproducción y sale del canal de voz')
    .addField("rl!di", "Roler repetirá lo que usted quiera que diga...")
    .addField("rl!roll", "Se lanzarán los dados y caera en una cantidad aleatoria entre el 1 a el 100")
    .addField("rl!ctof", "Conversión de Celsius a Fahrenheit")
    .addField("rl!ftoc", "Conversión de Fahrenheit a Celsius")
    .addField("rl!invite", "Roler enviará una invitación...")
    .addField("rl!minecraft", "Mostrará un gif de una partida de Minecraft")
    .addField("rl!startmint", "Mostrará un gif de Linux mint iniciando")
    .addField("rl!kali", "Mostrara un gif de un usuario usando Kali linux")
    .addField("Old Update", "Alpha 1.0.2")
    .addField("rl!credits", "Muestra los creditos a los programadores de Roler...")
    .addField("rl!division + [Números]", "Hace una divison entre los numeros ingresados")
    .addField("rl!suma + [Números]", "Hace una suma entre los numeros ingresados")
    .addField("rl!resta + [Números]", "Hace una resta entre los numeros ingresados")
    .addField("rl!multiplicacion + [Números]", "Hace una multiplicación entre los numeros ingresados")
    .addField("rl!searchgl + [Busqueda]", "Se hará una busqueda en Google sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchfb + [Busqueda]", "Se hará una busqueda en Facebook sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchyt + [Busqueda]", "Se hará una busqueda en Youtube sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .setFooter("Página 1 de 2")
    msg.channel.send(embed);
    }
  
  if (cmd === "help2") {
    const embed = new Discord.RichEmbed()
    .setTitle(`Felices fiestas navideñas!, Esta es la informacion y los comandos disponibles de Roler (Página 2)`)
    .setColor("#B3B3B3")
    .setThumbnail("https://cdn.discordapp.com/attachments/474331584447643658/654103434567352321/juegos-de-rol-655x368_1.jpg")
    .addField("Versión actual del bot:", "Alpha 1.0.6")
    .addField("Repositorio:", "https://github.com/BloxOfficial/roler")
    .addField("Old Update", "Alpha 1.0.3")
    .addField("rl!searchdz + [Busqueda]", "Se hará una busqueda en Deezer sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchsp + [Busqueda]", "Se hará una busqueda en Spotify sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchgh + [Busqueda]", "Se hará una busqueda en GitHub sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchvm + [Busqueda]", "Se hará una busqueda en Vimeo sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchst + [Busqueda]", "Se hará una busqueda en Steam sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchup + [Busqueda]", "Se hará una busqueda en Uptodown sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("Old Christmas Update", "Alpha 1.0.4")
    .addField("rl!searchab + [Busqueda]", "Se hará una busqueda en Animeblix sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchddg + [Busqueda]", "(Se recomienda usar DuckDuckGo al realizar busquedas para mayor privacidad) Se hará una busqueda en DuckDuckGo sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchsf + [Busqueda]", "Se hará una busqueda en Sourceforge sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchtw + [Busqueda]", "Se hará una busqueda en Twitch sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!bonfire", "Se mostrará un bonito Gif de una fogata para que te sientas calientito :3")
    .addField("rl!recetasnav", "Se mostrará un pequeño recetario navideño en un embed")
    .addField("Old Update", "Alpha 1.0.5")
    .addField("rl!searchtwt + [Busqueda]", "Se hará una busqueda en Twitter sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searcham + [Busqueda]", "Se hará una busqueda en Amazon sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")   
    .addField("rl!clear + [Cantidad]", "Se borra la cantidad de mensajes puestos despues del comando")
    .addField("rl!aboutkrakendev", "Información acerca de Kraken Development")
    .addField("rl!triggered", "Un gif de un perro modo Triggered")
    .addField("rl!browsersinfo", "Te muestra información completa sobre los 4 navegadores más usados (Chrome, Firefox, Opera, Safari)")
    .setFooter("Página 2 de 3")
    msg.channel.send(embed);
    }
  
  if (cmd === "help3") {
    const embed = new Discord.RichEmbed()
    .setTitle(`Felices fiestas navideñas!, Esta es la informacion y los comandos disponibles de Roler`) 
    .setColor("#B3B3B3")
    .setThumbnail("https://cdn.discordapp.com/attachments/474331584447643658/654103434567352321/juegos-de-rol-655x368_1.jpg")
    .addField("Versión actual del bot:", "Alpha 1.0.6")
    .addField("Repositorio:", "https://github.com/BloxOfficial/roler")
    .addField("New Update", "Alpha 1.0.6")
    .addField("rl!searchfm + [Busqueda]", "Se hará una busqueda en FontMeme sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchitchio + [Busqueda]", "Se hará una busqueda en Itch.io sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!dnatest + [Usuario]", "Se hará una prueba de ADN con el usuario mensionado")
    .addField("rl!question + [Pregunta]", "Roler responderá a la pregunta hecha")
    .addField("rl!darkmode", "Instrucciones para tener Github, StackOverflow y Wikipedia en modo oscuro")
    .addField("rl!serverinfo", "Se mostrará la información sobre el servidor en el que se encuentra el bot")
    .setFooter("Página 3 de 3")
    msg.channel.send(embed);
    }
 
if(cmd == "invite") {
  const embed = new Discord.RichEmbed()
  .setThumbnail("https://cdn.glitch.com/6476ce74-d53f-4f34-9cc9-2add854eda96%2FRolerNew.png?v=1579142145025")
  .setTitle(`Invita a Roler a tu servidor!`)
  .addField("Invita a Roler a tu servidor:", "https://discordapp.com/oauth2/authorize?client_id=654089433473089552&scope=bot&permissions=1207434689")
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
        embed.setColor("#B3B3B3")
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
        embed.setColor("#B3B3B3")
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
        embed.setColor("#B3B3B3")
        msg.channel.send(embed); 
    };

  if(cmd == "credits") {
    const embed = new Discord.RichEmbed()
    .setTitle('Creditos')
    .setDescription('Muchas gracias por el apoyo brindado en el desarrollo de Roler, de verdad, muchas gracias...')
    .addField("Desarrollo del bot:", "Blox#5019, Persea gatuna#6354")
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
    embed.setDescription(`información de el usuario ${mencionado.user.username}`)
    embed.setThumbnail(mencionado.user.displayAvatarURL)
    embed.setColor("RANDOM")
    embed.addField("tag y nombre", `${mencionado.user.tag}`)
    embed.addField("Entro en", mencionado.joinedAt.toDateString(), true)
    embed.addField("ID", `${mencionado.id}`)
    embed.addField("Estado", `${estados[mencionado.presence.status]}`)
    embed.addField("roles de el usuario", `${mencionado.roles.map(m => m).join("**-**")}`)
    embed.setColor("#B3B3B3")
    msg.channel.send(embed);
    };
  
  //Old Update (Alpha 1.0.2) 
  
  if(cmd == "songs") {
    const embed = new Discord.RichEmbed()
    .setTitle('Te recomiendo 100% estas canciones...')
    .setDescription('Estas son 5 de mis canciones favoritas :heart:')
    .setColor("#B3B3B3")
    .addField("#1.-", "Akeos - Corporation")
    .addField("#2.-", "Porter Robinson - Goodbye to a world")
    .addField("#3.-", "Jack Stauber - Buttercup")
    .addField("#4.-", "Svdden Death - Last life")
    .addField("#5.-", "Home - Resonance")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  };
  
  
  if(cmd == "randomvid") {
    let vids = 1;
    let random = Math.floor(Math.random() * (vids + 1 - 1)) + 1;
    const embed = new Discord.RichEmbed()
    .setTitle('Vídeo random...')
    .setDescription('Aquí un tremendo videazo random')
    switch(random) {
      case 1: embed.addField("Espera, que mierda: ", "https://www.youtube.com/watch?v=twaV91SAXE4"); break;
  };
   embed.setColor("#B3B3B3");
   msg.channel.send(embed)
  }
  
  //COMANDOS BUSQUEDA
  
  //BUSQUEDA GOOGLE
  
if(cmd === "searchgl") {
  let searchQTitle = args.join(" ")
    let searchQ = args.join("");  
    let searchE = ('search?q=' + searchQ + '&sourceid=discord');
    if(!searchQ) return msg.channel.send('Que querias buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn0.iconfinder.com/data/icons/social-network-9/50/2-512.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En google) Buscaste ' + searchQTitle,)
    .addField("https://www.google.com/" + searchE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  //BUSQUEDA FACEBOOK
  
  if(cmd === "searchfb") {
  let searchQTitleFB = args.join(" ")
    let searchFBQ = args.join("");  
    let searchFE = ('?q=' + searchFBQ + '&sourceid=discord');
    if(!searchFBQ) return msg.channel.send('Que querias buscar?');
    const embed = new Discord.RichEmbed() 
    .setThumbnail("https://media.discordapp.net/attachments/654106991626813453/655864871904215072/fac.png?width=225&height=225")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En facebook) Buscaste ' + searchQTitleFB)
    .addField("https://www.facebook.com/search/top/" + searchFE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }

  //BUSQUEDA YOUTUBE
  
  if(cmd === "searchyt") {
    let searchQTitleYT = args.join(" ")
    let searchYTQ = args.join("+");
    let searchYTE = ('results?search_query=' + searchYTQ + '&page=&utm_source=discord');
    if(!searchYTQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://media.discordapp.net/attachments/654106991626813453/655863923437993984/circlelogomediasocialvideoyoutubeicon-1320192912857768428.png?width=225&height=225")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En youtube) Buscaste ' + searchQTitleYT)
    .addField("https://www.youtube.com/" + searchYTE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  //COMANDOS HORARIO 
  
  if(cmd == "hmxtoar") {
let mx = parseInt(args.join(" "));
    let arg = mx + 3;
    if(!mx) return msg.channel.send('Debes ingresar la hora de México');
    if(mx > 24) return msg.channel.send('Debes ingresar una hora válida (24 o menos)')
    
    if(arg > 24) {
      var arg24 = parseInt(arg) - 24;
    } else {
      var arg24 = arg
    }
    
    const embed = new Discord.RichEmbed()
    .setTitle('Hora Mx a Hora Ar')
    .setDescription('Esta es la hora mexicana convertida a hora argentina (Formato 24 hs)')
    .addField("Hora mexicana a argentina: ", + arg24 + ':00')
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  if(cmd == "hartomx") {
let arg = parseInt(args.join(" "));
    let mex = arg - 3;
    if(!arg) return msg.channel.send('Debes ingresar la hora de Argentina');
    if(arg > 24) return msg.channel.send('Debes ingresar una hora válida (24 o menos)')
    
    if(mex > 24) {
      var mex24 = parseInt(mex) - 24;
    } else {
      var mex24 = mex
    }
    
    const embed = new Discord.RichEmbed()
    .setTitle('Hora Ar a Hora Mx')
    .setDescription('Esta es la hora argentina convertida a hora mexicana (Formato 24 hs)')
    .addField("Hora argentina a mexicana: ", + mex24 + ':00')
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  //COMANDOS DE ECUACIONES
  
  if(cmd === "suma") {
    let n1 = parseInt(args[0]);
    let n2 = parseInt(args[1]);
    if(!n1 || !n2) return msg.channel.send('Debes ingresar al menos 2 números');
    if(!args[2]) {
    let resultado = n1 + n2
    
    const embed = new Discord.RichEmbed()
    .setTitle('Suma')
    .addField('Ecuación:', + n1 + ' + ' + n2)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
      msg.channel.send(embed);
    } else if(!args[3]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      
      let resultado = n1 + n2 + n3
      
      const embed = new Discord.RichEmbed()
    .setTitle('Suma')
    .addField('Ecuación:', + n1 + ' + ' + n2 + ' + ' + n3)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
      msg.channel.send(embed);
    } else if(!args[4] && args[3]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      let n4 = parseInt(args[3]);
      
      let resultado = n1 + n2 + n3 + n4
      
      const embed = new Discord.RichEmbed()
    .setTitle('Suma')
    .addField('Ecuación:', + n1 + ' + ' + n2 + ' + ' + n3 + ' + ' + n4)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
    msg.channel.send(embed);
    } else if(args[4] && !args[5]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      let n4 = parseInt(args[3]);
      let n5 = parseInt(args[4]);
      
      let resultado = n1 + n2 + n3 + n4 + n5
      
      const embed = new Discord.RichEmbed()
    .setTitle('Suma')
    .addField('Ecuación:', + n1 + ' + ' + n2 + ' + ' + n3 + ' + ' + n4 + ' + ' + n5)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
    msg.channel.send(embed);
    } else{
      msg.channel.send('No se pueden hacer ecuaciones de más de 5 números')
    }
  }
  
  
  
  if(cmd === "division") {
    let n1 = parseInt(args[0]);
    let n2 = parseInt(args[1]);
    if(!n1 || !n2) return msg.channel.send('Debes ingresar al menos 2 números');
    if(!args[2]) {
    let resultado = n1 / n2
    
    const embed = new Discord.RichEmbed()
    .setTitle('División')
    .addField('Ecuación:', + n1 + ' ÷ ' + n2)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
      msg.channel.send(embed);
    } else if(!args[3]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      
      let resultado = n1 / n2 / n3
      
      const embed = new Discord.RichEmbed()
    .setTitle('División')
    .addField('Ecuación:', + n1 + ' ÷ ' + n2 + ' ÷ ' + n3)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
      msg.channel.send(embed);
    } else if(!args[4] && args[3]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      let n4 = parseInt(args[3]);
      
      let resultado = n1 / n2 / n3 / n4
      
      const embed = new Discord.RichEmbed()
    .setTitle('División')
    .addField('Ecuación:', + n1 + ' ÷ ' + n2 + ' ÷ ' + n3 + ' ÷ ' + n4)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
    msg.channel.send(embed);
    } else if(args[4] && !args[5]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      let n4 = parseInt(args[3]);
      let n5 = parseInt(args[4]);
      
      let resultado = n1 / n2 / n3 / n4 / n5
      
      const embed = new Discord.RichEmbed()
    .setTitle('División')
    .addField('Ecuación:', + n1 + ' ÷ ' + n2 + ' ÷ ' + n3 + ' ÷ ' + n4 + ' ÷ ' + n5)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
    msg.channel.send(embed);
    } else{
      msg.channel.send('No se pueden hacer ecuaciones de más de 5 números')
    }
  }
  
  if(cmd === "resta") {
    let n1 = parseInt(args[0]);
    let n2 = parseInt(args[1]);
    if(!n1 || !n2) return msg.channel.send('Debes ingresar al menos 2 números');
    if(!args[2]) {
    let resultado = n1 - n2
    
    const embed = new Discord.RichEmbed()
    .setTitle('Resta')
    .addField('Ecuación:', + n1 + ' - ' + n2)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
      msg.channel.send(embed);
    } else if(!args[3]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      
      let resultado = n1 - n2 - n3
      
      const embed = new Discord.RichEmbed()
    .setTitle('Resta')
    .addField('Ecuación:', + n1 + ' - ' + n2 + ' - ' + n3)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
      msg.channel.send(embed);
    } else if(!args[4] && args[3]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      let n4 = parseInt(args[3]);
      
      let resultado = n1 - n2 - n3 - n4
      
      const embed = new Discord.RichEmbed()
    .setTitle('Resta')
    .addField('Ecuación:', + n1 + ' - ' + n2 + ' - ' + n3 + ' - ' + n4)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
    msg.channel.send(embed);
    } else if(args[4] && !args[5]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      let n4 = parseInt(args[3]);
      let n5 = parseInt(args[4]);
      
      let resultado = n1 * n2 * n3 * n4 * n5
      
      const embed = new Discord.RichEmbed()
    .setTitle('Resta')
    .addField('Ecuación:', + n1 + ' - ' + n2 + ' - ' + n3 + ' - ' + n4 + ' - ' + n5)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
    msg.channel.send(embed);
    } else{
      msg.channel.send('No se pueden hacer ecuaciones de más de 5 números')
    }
  }
  
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
  
  if(cmd === "multiplicacion") {
    let n1 = parseInt(args[0]);
    let n2 = parseInt(args[1]);
    if(!n1 || !n2) return msg.channel.send('Debes ingresar al menos 2 números');
    if(!args[2]) {
    let resultado = n1 * n2
    
    const embed = new Discord.RichEmbed()
    .setTitle('Multiplicación')
    .addField('Ecuación:', + n1 + ' x ' + n2)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
      msg.channel.send(embed);
    } else if(!args[3]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      
      let resultado = n1 * n2 * n3
      
      const embed = new Discord.RichEmbed()
    .setTitle('Multiplicación')
    .addField('Ecuación:', + n1 + ' x ' + n2 + ' x ' + n3)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
      msg.channel.send(embed);
    } else if(!args[4] && args[3]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      let n4 = parseInt(args[3]);
      
      let resultado = n1 * n2 * n3 * n4
      
      const embed = new Discord.RichEmbed()
    .setTitle('Multiplicación')
    .addField('Ecuación:', + n1 + ' x ' + n2 + ' x ' + n3 + ' x ' + n4)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
    msg.channel.send(embed);
    } else if(args[4] && !args[5]) {
      let n1 = parseInt(args[0]);
      let n2 = parseInt(args[1]);
      let n3 = parseInt(args[2]);
      let n4 = parseInt(args[3]);
      let n5 = parseInt(args[4]);
      
      let resultado = n1 * n2 * n3 * n4 * n5
      
      const embed = new Discord.RichEmbed()
    .setTitle('Multiplicación')
    .addField('Ecuación:', + n1 + ' x ' + n2 + ' x ' + n3 + ' x ' + n4 + ' x ' + n5)
    .addField('Resultado:', + resultado)
    .setColor("B3B3B3");
    msg.channel.send(embed);
    } else{
      msg.channel.send('No se pueden hacer ecuaciones de más de 5 números')
    }
}
  
  //Old Update (Alpha 1.0.3)
  
  //NUEVOS COMANDOS BUSQUEDA
  
  if(cmd === "searchdz") {
    let searchQTitleDZ = args.join(" ")
    let searchDZQ = args.join("%20");
    let searchDZE = ('search/' + searchDZQ);
    if(!searchDZQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn.iconscout.com/icon/free/png-512/deezer-461785.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En deezer) Buscaste ' + searchQTitleDZ)
    .addField("https://www.deezer.com/es/" + searchDZE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  if(cmd === "searchsp") {
    let searchQTitleSP = args.join(" ")
    let searchSPQ = args.join("%20");
    let searchSPE = ('search/' + searchSPQ);
    if(!searchSPQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://media.discordapp.net/attachments/654106991626813453/655862803638386754/Spotify_icon-icons.com_66783.png?width=225&height=225")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En spotify) Buscaste ' + searchQTitleSP)
    .addField("https://open.spotify.com/" + searchSPE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
   
  if(cmd === "searchst") {
    let searchQTitleST = args.join(" ")
    let searchSTQ = args.join("+");
    let searchSTE = ('search/?term=' + searchSTQ);
    if(!searchSTQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_steam-512.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En steam) Buscaste ' + searchQTitleST)
    .addField("https://store.steampowered.com/" + searchSTE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
    if(cmd === "searchvm") {
    let searchQTitleVM = args.join(" ")
    let searchVMQ = args.join("+");
    let searchVME = ('search/?q=' + searchVMQ);
    if(!searchVMQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn.discordapp.com/attachments/654106991626813453/655862045782048781/vim.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En vimeo) Buscaste ' + searchQTitleVM)
    .addField("https://vimeo.com/" + searchVME, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  if(cmd === "searchgh") {
    let searchQTitleGH = args.join(" ")
    let searchGHQ = args.join("+");
    let searchGHE = ('search/?q=' + searchGHQ);
    if(!searchGHQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn.discordapp.com/attachments/654106991626813453/655860055534469160/5847f98fcef1014c0b5e48c0.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En github) Buscaste ' + searchQTitleGH)
    .addField("https://github.com/" + searchGHE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  if(cmd === "searchup") {
    let searchQTitleUP = args.join(" ")
    let searchUPQ = args.join("+");
    let searchUPE = ('windows/search/' + searchUPQ);
    if(!searchUPQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn.discordapp.com/attachments/654106991626813453/655858937245204500/Edfb4Zcg.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En uptodownWindows) Buscaste ' + searchQTitleUP)
    .addField("https://en.uptodown.com/" + searchUPE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  //Old Christmas update (Alpha 1.0.4)
  
    
  if(cmd === "searchab") {
    let searchQTitleAB = args.join(" ")
    let searchABQ = args.join("+");
    let searchABE = ('animes?nombre=' + searchABQ);
    if(!searchABQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://cdn.discordapp.com/attachments/654106991626813453/655966809563856906/ab.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En AnimeBlix) Buscaste ' + searchQTitleAB)
    .addField("https://animeblix.com/" + searchABE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
      
  if(cmd === "searchddg") {
    let searchQTitleDDG = args.join(" ")
    let searchDDGQ = args.join("+");
    let searchDDGE = ('?q=' + searchDDGQ + "&atb=v199-6__&ia=web");
    if(!searchDDGQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F4.bp.blogspot.com%2F-W3IWzydE5wY%2FVMUaVJl5HmI%2FAAAAAAAAAUk%2FNUMHrn-VJIs%2Fs1600%2FDuckDuckGo%252BLogo.png&f=1&nofb=1")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En DuckDuckGo) Buscaste ' + searchQTitleDDG)
    .addField("https://duckduckgo.com/" + searchDDGE, "Cliquea la página para ver su contenido")
    .setFooter("Para mayor privacidad al navegar te recomendamos usar DuckDuckGo como motor de busqueda...", "https://duckduckgo.com/")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
    if(cmd === "searchsf") {
    let searchQTitleSF = args.join(" ")
    let searchSFQ = args.join("+");
    let searchSFE = ('?q=' + searchSFQ);
    if(!searchSFQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://a.fsdn.com/con/img/sandiego/logo-180x180.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En Sourceforge) Buscaste ' + searchQTitleSF)
    .addField("https://sourceforge.net/directory/os:windows/" + searchSFE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
    if(cmd === "searchtw") {
    let searchQTitleTW = args.join(" ")
    let searchTWQ = args.join("+");
    let searchTWE = ('search?term=' + searchTWQ);
    if(!searchTWQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("http://pngimg.com/uploads/twitch/twitch_PNG37.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En Twitch) Buscaste ' + searchQTitleTW)
    .addField("https://www.twitch.tv/" + searchTWE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
 
      if(cmd == "bonfire") {
      let img = 1;
        var random = Math.floor(Math.random() * (img - 1 + 1)) + 1;
        const embed = new Discord.RichEmbed()
        switch(random) {
          case 1: embed.setImage("http://4.bp.blogspot.com/-jaAUkGrCcVY/U6x0EyTPovI/AAAAAAADBZs/TqXn7-QLAl4/s1600/_DSC9577+%2528Copiar%2529-MOTION.gif"); break;
        }
        embed.setTitle('Una fogata para calentarte :heart: :fire:')
        embed.setColor("#B3B3B3")
        embed.setDescription(`Una fogata para calentarte en estas fiestas navideñas <3`)
        msg.channel.send(embed);
    }
  
  if (cmd === "recetasnav") {
    const embed = new Discord.RichEmbed()
    .setTitle('Unas recetas navideñas para que disfrutes estas fiestas cocinando y comiendo :3')
    .setColor("#FF3C3C")
    .setDescription('Para ver la receta pon rl!rn + nombre (sin espacios y en minusculas), Ejemplo: rl!rnponchedefrutas')
    .setThumbnail("https://images.vexels.com/media/users/3/133024/isolated/preview/05384b21cf85761ee636949d6db7c78e-christmas-ball-cartoon-icon-137-by-vexels.png")
    .addField("Fuente:", "https://www.kiwilimon.com/temporada/navidad/posadas")
    .addField("Bebidas/Semiliquidos: ", "Ponche de frutas, Nieve de ponche")
    .addField("Postres: ", "Tamales caseros")
    .setFooter("Página 1 de 1");
    msg.channel.send(embed);
  }
  
  if (cmd === "rnponchedefrutas") {
    const embed = new Discord.RichEmbed()
    .setTitle('Aprende a hacer ponche de frutas! :D')
    .setColor("#FF3C3C")
    .setThumbnail("https://images.vexels.com/media/users/3/133024/isolated/preview/05384b21cf85761ee636949d6db7c78e-christmas-ball-cartoon-icon-137-by-vexels.png")
    .addField("Fuente:", "https://www.kiwilimon.com/temporada/navidad/posadas")
    .addField("Ingredientes:", "1/4 de kilo de flor de jamaica, 1 raja de canela desmenuzada, 1 kilo de azúcar al gusto, 1/4 de kilo de tejocote, 1/4 de kilo de tamarindo, 1/2 kilo de guayaba en cubitos, 1/2 kilo de manzana en cubitos, 1/4 de kilo de pasa, 1/4 de kilo de ciruela, 1 bolsita de caña pelada y cortada en tiras chicas")
    .addField("Preparación:", "Cuece juntas la jamaica y la canela en agua suficiente, durante 30 minutos. Cuando la jamaica esté casi lista, pon la mitad del azúcar en una olla con capacidad para 30 litros y prende el fuego para que se derrita y se haga caramelo. Vierte dentro de la misma olla el líquido de cocción de la jamaica, colado. Desecha la flor y la canela. Cuece aparte los tejocotes con un poco de agua. Retira del fuego en cuanto den un hervor. Permite que se enfríen y pélalos. Luego, pártelos a la mitad, retira el corazón y rebana las mitades en lunas. Vierte el agua de cocimiento de los tejocotes a la olla grande, así como los tejocotes rebanados. Cuece el tamarindo en otra olla con agua. Exprime y cuela la pulpa en la olla del ponche. Luego, agrega la guayaba, manzana, pasitas, ciruelas pasas y caña. Agrega tanta agua como sea necesario y el resto del azúcar, o al gusto. Deja que el ponche hierva durante por los menos 1 hora.")
    .setFooter("Página 1 de 1");
    msg.channel.send(embed);
  }
  
  if (cmd === "rnnievedeponche") {
    const embed = new Discord.RichEmbed()
    .setTitle('Aprende a hacer nieve de ponche! :D')
    .setColor("#FF3C3C")
    .setThumbnail("https://images.vexels.com/media/users/3/133024/isolated/preview/05384b21cf85761ee636949d6db7c78e-christmas-ball-cartoon-icon-137-by-vexels.png")
    .addField("Fuente:", "https://www.kiwilimon.com/temporada/navidad/posadas/helado/nieve-de-ponche")
    .addField("Ingredientes:", "1 paquete de Bolsas Storeit® para Congelar Mediana, 1 litro de ponche de frutas")
    .addField("Preparación:", "Etiqueta tus bolsas para congelar Storeit® mediana. Cuela el ponche de frutas y reserva solo el líquido. Introduce el líquido en la bolsa para congelar Storeit® mediana. Congela por 2 horas o hasta que se solidifique. Retíralo de la bolsa y muélelo en la licuadora. Sirve.")
    .setFooter("Página 1 de 1");
    msg.channel.send(embed);
  }
  
  
   if (cmd === "rntamalescaseros") {
    const embed = new Discord.RichEmbed()
    .setTitle('Aprende a hacer tamales caseros! :D')
    .setColor("#FF3C3C")
    .setThumbnail("https://images.vexels.com/media/users/3/133024/isolated/preview/05384b21cf85761ee636949d6db7c78e-christmas-ball-cartoon-icon-137-by-vexels.png")
    .addField("Fuente:", "https://www.kiwilimon.com/temporada/navidad/posadas")
    .addField("Ingredientes:", "250 gramos de manteca de cerdo (para la masa), 500 gramos de harina para tamales (para la masa), 1 taza de caldo de pollo (para la masa), 1 cucharadita de polvo para hornear (para la masa), 1 cucharadita de sal (para la masa), 1 cucharadita de pimienta (para la masa), 1 litro de agua, 500 gramos de tomate verde, 5 chiles serranos, 1 diente de ajo sin cáscara, 1/4 de cebolla, 3 cucharadas de aceite, 2 pizcas de sal fina, 1 pizca de pimienta negra molida, 1 pechuga de pollo sin hueso cocida y desmenuzada. 10 hojas de maíz para tamal remojadas en agua.")
    .setFooter("Página 1 de 1");
    msg.channel.send(embed);
  }
  
  //Old Update (Alpha 1.0.5)
  
 if(cmd == "triggered") {
    let respuestas = 2;
    let randomR = Math.floor(Math.random() * (respuestas + 1 -1)) + 1;
    const embed = new Discord.RichEmbed()
    .setTitle(`${msg.author.username} estalló, huyan :exploding_head:!`)
    switch(randomR) {
        case 1: embed.setImage("https://i.imgur.com/8zeH0rs.gif"); break;
      }
        embed.setColor("#B3B3B3")
        msg.channel.send(embed);
    };
  
    if(cmd == "clear") {
        if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("no tienes permisos para usar este comando.")
        if(!args[0]) return msg.channel.send("Debes ingresar el numero de mensajes a borrar")
        let number = args[0]
        if(isNaN(number)) return msg.channel.send("Necesitas poner numeros, no letras ni simbolos")
        number = parseInt(number)
        if(number >= 101 || number <= 0) return msg.channel.send("Debes ingresar un valor menor a 100 y mayor a 0")
        msg.channel.bulkDelete(number + 1 ).then( () => {
            msg.channel.send(`Roler limpió el chat borrando ${number} mensajes`).then(m => m.delete(5000))
        }).catch(error => {
            msg.channel.send(`ocurrio un error ${error.msg}`)
        })
    };
  
   if (cmd === "aboutkrakendev") {
    const embed = new Discord.RichEmbed()
    .setTitle('Está es la información acerca de Kraken Development')
    .setColor("#B3B3B3")
    .setThumbnail("https://cdn.discordapp.com/attachments/660959799369793568/665015063471456258/Krakendev.png")
    .addField("Fundadores:", "Blox, Gatolandia")
    .addField("Página web oficial:", "https://krakendevelopment.glitch.me/")
    .addField("Servicio de hosting usado:", "Glitch")
    .addField("Acerca de Kraken Development:", "Un equipo de desarrollo que mayormente trabaja con código abierto")
    .addField("Organización en GitHub:", "https://github.com/Kraken-Development")
    msg.channel.send(embed);
  }
  
  if(cmd === "searchtwt") {
    let searchQTitleTWT = args.join(" ")
    let searchTWTQ = args.join("%20");
    let searchTWTE = ('search?q=' + searchTWTQ + '&src=typed_query');
    if(!searchTWTQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("http://nightowlcyber.com/wp-content/uploads/2015/03/Twitter-icon-512x512.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En Twitter) Buscaste ' + searchQTitleTWT)
    .addField("https://twitter.com/" + searchTWTE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  
  if(cmd === "searcham") {
    let searchQTitleAM = args.join(" ")
    let searchAMQ = args.join("+");
    let searchAME = ('s?k=' + searchAMQ + '&ref=nb_sb_noss');
    if(!searchAMQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://www.stanleyidesis.com/assets/images/book-modal/amazon-icon.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En Amazon) Buscaste ' + searchQTitleAM)
    .addField("https://www.amazon.com/" + searchAME, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  if (cmd === "browsersinfo") {
    const embed = new Discord.RichEmbed()
    .setTitle('Está es la información acerca de los navegadores web más usados actualmente...')
    .setColor("#B3B3B3")
    .setThumbnail("https://cdn.discordapp.com/attachments/654106991626813453/665025710183940119/wi.png")
    .addField("Chrome:", "Motor de renderizado: Blink, Versión actual: Chrome 79.0.3945.88, Motores de busqueda: Google, DuckDuckGo, Bing, Yahoo, etc..., Descargalo: https://www.google.com.mx/chrome/")
    .addField("Firefox:", "Motor de renderizado: Gecko, Versión actual: Firefox 72.0, Motores de busqueda: Google, DuckDuckGo, Bing, Yahoo, etc..., Descargalo: https://www.mozilla.org/es-MX/firefox/new/")
    .addField("Opera:", "Motor de renderizado: Presto, Versión actual: Opera 65, Motores de busqueda: Google, DuckDuckGo, Bing, Yahoo, etc..., Descargalo: https://www.opera.com/es-419")
    .addField("Safari:", "Motor de renderizado: KHTML, Webkit, Versión actual: Safari 13.0, Motores de busqueda: Google, DuckDuckGo, Bing, Yahoo, etc..., Descargalo: https://www.apple.com/mx/safari/")
    msg.channel.send(embed);
  }
  
  //New Update (Alpha 1.0.6)
   
  if(cmd === "searchfm") {
    let searchQTitleFM = args.join(" ")
    let searchFMQ = args.join("+");
    let searchFME = ('?s=' + searchFMQ);
    if(!searchFMQ) return msg.channel.send('¿Que fuente necesitas?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://d2.alternativeto.net/dist/icons/font-meme_67328.png?width=128&height=128&mode=crop&upscale=false")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En Fontmeme) Buscaste ' + searchQTitleFM)
    .addField("https://fontmeme.com/" + searchFME, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
   if(cmd === "searchitchio") {
    let searchQTitleITCHIO = args.join(" ")
    let searchITCHIOQ = args.join("+");
    let searchITCHIOE = ('search?q=' + searchITCHIOQ);
    if(!searchITCHIOQ) return msg.channel.send('¿Que fuente necesitas?');
    const embed = new Discord.RichEmbed()
    .setThumbnail("https://static.itch.io/images/app-icon.png")
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En itch.io) Buscaste ' + searchQTitleITCHIO)
    .addField("https://itch.io/" + searchITCHIOE, "Cliquea la página para ver su contenido, Disfruta tu juego :wink:")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  if (cmd == "dnatest") {
    let sh = 100;
    let latencia = Math.floor(Math.random() * (sh - 1 + 1)) + 1;
    let mencionado = msg.mentions.members.first();
    if(!mencionado) return msg.reply("¿Con quién quieres comprobar tu compatibilidad de ADN?")
    function roll() { 
    const embed = new Discord.RichEmbed();
      
      embed.setThumbnail('https://cdn.discordapp.com/attachments/474331584447643658/667841491967672334/img_4935.png')
      embed.setAuthor(`Prueba de ADN pedida por ${msg.author.username}...`)
      embed.setTitle("Estos son los resultados de la prueba de ADN... :dna:")
      embed.setColor("#B3B3B3")
      embed.addField('La compatibilidad de ADN de **' + msg.author.username + '** con **' + mencionado.user.username + '** es del... ', `${latencia}%`);
      msg.channel.send(embed);
      
  }
      msg.channel.send('Extrayendo sangre y comprobando compatibilidad...');
      
      setTimeout(roll, 2000);
}
  
   if(cmd == "question") {
          let pregunta = args.join(' ');
          let respuestas = 10;
          let randomR = Math.floor(Math.random() * (respuestas + 1 - 1)) + 1;
          if(!pregunta) return msg.reply("Debes preguntarme algo!")
   const embed = new Discord.RichEmbed();
          embed.setTitle(`Preguntame algo!`)
          embed.addField("Pregunta:", `${pregunta}`)
          embed.setAuthor(`Pregunta de: ${msg.author.username}`, msg.author.displayAvatarURL)
          embed.setColor("B3B3B3")
          switch(randomR) {
            case 1: embed.addField("Respuesta:", "Verdadero!") ; break;
            case 2: embed.addField("Respuesta:", "Probablemente") ; break;
            case 3: embed.addField("Respuesta:", "Claro que no") ; break;
            case 4: embed.addField("Respuesta:", "nOoOooOO") ; break;
            case 5: embed.addField("Respuesta:", "VERDADERO!") ; break;
            case 6: embed.addField("Respuesta:", "No lo se") ; break;
            case 7: embed.addField("Respuesta:", "Quizás") ; break;
            case 8: embed.addField("Respuesta:", "Probablemente si") ; break;
            case 9: embed.addField("Respuesta:", "Dime tú") ; break;
            case 10: embed.addField("Respuesta:", "Acaso la respuesta no es obvia?") ; break;
          };
          msg.channel.send(embed);
        }
  
  if (cmd === "darkmode") {
    const embed = new Discord.RichEmbed()
    .setTitle('Modo Oscuro en Github, StackOverflow, Wikipedia')
    .setDescription('Intrucciones para tener modo oscuro en Github, StackOverflow y Wikipedia...')
    .setColor("#B3B3B3")
    .setThumbnail("https://avatars1.githubusercontent.com/u/6145677?s=200&v=4")
    .addField("#1: ", "Instalar extensión Stylus: https://add0n.com/stylus.html")
    .addField("#2" , "Al tenerla instalada solo necesitas darle a los enlaces siguientes:")
    .addField("Github:", "https://raw.githubusercontent.com/StylishThemes/GitHub-Dark/master/github-dark.user.css")
    .addField("StackOverflow:", "https://raw.githubusercontent.com/StylishThemes/StackOverflow-Dark/master/stackoverflow-dark.user.css")
    .addField("Wikipedia:", "https://raw.githubusercontent.com/StylishThemes/Wikipedia-Dark/master/wikipedia-dark.user.css")
    .addField("Creditos por los temas a:", "https://github.com/StylishThemes")
    msg.channel.send(embed);
  }
  
   if(cmd == "serverinfo") {
        var server = msg.guild;
        const embed = new Discord.RichEmbed()
        .setThumbnail(server.iconURL)
        .setAuthor(server.name, server.iconURL)
        .addField("Región:", server.region, true)
        .addField('Creado el:', server.joinedAt.toDateString(), true)
        .addField('Creador:', server.owner.user.tag, true)
        .addField('Miembros:', server.memberCount, true)
        .addField('Roles:', server.roles.size, true)
        .setColor("B3B3B3");
        msg.channel.send(embed);
    };
  
});

client.login(config.token);