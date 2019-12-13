//ANTES QUE NADA, LOS COMANDOS Y SU CONTENIDO ESTARÁ EN ESPAÑOL/BEFORE ANYTHING, THE COMMANDS AND THEIR CONTENT WILL BE IN SPANISH.
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const db = require("megadb");
console.log("Esta es una version alpha <3, Disfruta la nueva Alpha 1.0.2");
let warn_db = new db.crearDB("warns", "moderacion");
let logs_db = new db.crearDB("logs", "moderacion");
let prefix = 'rl!';

var queue = new Map();

client.on("ready", () => {
  console.log("Roler está listo para ser usado");
  console.log("Nuevos comandos agregados (Ecuaciones, Info actualizada, Fahrenheit a Clesius y viceversa, Hora MX a ARG y viceversa, SearchFB/GL/YT Busqueda en estas 3 páginas <3)");
  client.user.setPresence({
    status: "online",
    game: {
      name: "rl!help, Alpha 1.0.2",
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

  //COMANDOS UTILES:

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
    const embed = new Discord.RichEmbed()
      .setAuthor(`Dados tirados por ${msg.author.username}...`)
      .setTitle("Los dados cayeron en...")
      .setColor("#B3B3B3")
      .addField("Los dados cayeron en...", + latencia);
    msg.channel.send(embed);
  }
  
  if (cmd === "help") {
    const embed = new Discord.RichEmbed()
    .setTitle(`Esta es la informacion y los comandos disponibles de Roler`) //pongo eso en vez de informacion del bot para no ser tan repetitvo con los otros bots que hacemos
    .setColor("#B3B3B3")
    .setThumbnail("https://cdn.discordapp.com/attachments/474331584447643658/654103434567352321/juegos-de-rol-655x368_1.jpg")
    .addField("Versión del bot:", "Beta 1.0.2")
    .addField("Repositorio:", "https://github.com/BloxOfficial/roler")
    .addField('rl!play', 'Reproduce una URL de YouTube')
    .addField('rl!stop', 'Detiene la reproducción y sale del canal de voz')
    .addField("rl!di", "Roler repetirá lo que usted quiera que diga...")
    .addField("rl!roll", "Se lanzarán los dados y caera en una cantidad aleatoria entre el 1 a el 100")
    .addField("rl!ctof", "Conversión de Celsius a Fahrenheit")
    .addField("rl!ftoc", "Conversión de Fahrenheit a Celsius")
    .addField("rl!invite", "Roler enviara una invitacion...")
    .addField("rl!minecraft", "Mostrará un gif de una partida de Minecraft")
    .addField("rl!startwindows7", "Mostrará un gif de WIndows7 iniciando")
    .addField("rl!startmint", "Mostrará un gif de Linux mint iniciando")
    .addField("rl!kali", "Mostrara un gif de un usuario usando Kali linux")
    .addField("rl!searchgl + [Busqueda]", "Se hará una busqueda en Google sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchfb + [Busqueda]", "Se hará una busqueda en Facebook sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!searchyt + [Busqueda]", "Se hará una busqueda en Youtube sobre lo que haya ingresado despues del comando, Roler pondra el enlace en el embed")
    .addField("rl!credits", "Muestra los creditos a los programadores de Roler...")
    .addField("rl!division + [Números]", "Hace una divison entre los numeros ingresados")
    .addField("rl!suma + [Números]", "Hace una suma entre los numeros ingresados")
    .addField("rl!resta + [Números]", "Hace una resta entre los numeros ingresados")
    .addField("rl!multiplicacion + [Números]", "Hace una multiplicación entre los numeros ingresados")
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
  
  //New Update (Alpha 1.0.3)
  
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
  
  //Busqueda con Google...
  
if(cmd === "searchgl") {
  let searchQTitle = args.join(" ")
    let searchQ = args.join("");  
    let searchE = ('search?q=' + searchQ + '&sourceid=discord');
    if(!searchQ) return msg.channel.send('Que querias buscar?');
    const embed = new Discord.RichEmbed()
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En google) Buscaste ' + searchQTitle,)
    .addField("https://www.google.com/" + searchE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  
  //Busqueda con Facebook..
  if(cmd === "searchfb") {
  let searchQTitleFB = args.join(" ")
    let searchFBQ = args.join("");  
    let searchFE = ('?q=' + searchFBQ + '&sourceid=discord');
    if(!searchFBQ) return msg.channel.send('Que querias buscar?');
    const embed = new Discord.RichEmbed() 
    .setDescription(`Busqueda realizada por **${msg.author.username}**`)
    .setTitle('(En facebook) Buscaste ' + searchQTitleFB)
    .addField("https://www.facebook.com/search/top/" + searchFE, "Cliquea la página para ver su contenido")
    .setColor("#B3B3B3");
    msg.channel.send(embed);
  }
  //hazlo tu deja checo cual era, xd era icon.URL, no? awanta actualizare...
  if(cmd === "searchyt") {
    let searchQTitleYT = args.join(" ")
    let searchYTQ = args.join("+");
    let searchYTE = ('results?search_query=' + searchYTQ + '&page=&utm_source=discord');
    if(!searchYTQ) return msg.channel.send('Que querías buscar?');
    const embed = new Discord.RichEmbed()
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
  
});

 client.login(process.env.token);
