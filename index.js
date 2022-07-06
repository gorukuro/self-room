const { Client } = require('legend.js');
const {Intents, Collection} = require("discord.js");

const bot = new Client({
  loginAsUserAccount: true,
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  shardCount: 1,
});

const fs = require("fs");
const express = require("express");
const app = new express();
const _PORT = process.env.PORT || 3000;
bot.prefix = process.env.PREFIX || "MmM";


// register command
bot.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for( const file of commandFiles){
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
  console.log(`registering ${file} as ${command.name}`);
}

// event listener
bot.on("ready", ()=> {
  console.log(JSON.stringify(bot.user.username + " is ready"));
  console.log(bot.user);
  app.listen(_PORT, () => console.log("listen to port: "+_PORT))
});

bot.on("message", msg => {
  if(msg.content.startsWith(bot.prefix) && !msg.author.bot){
    // console.log(msg.content);
    require("./handler.js")(msg, bot);
  }
})


// read cntl

app.get("/", (req, resp)=>{
  fs.readFile("./header.txt", (err,cntl)=> {
    var description = `<pre >${cntl}</pre>
    <b>${bot.user.username}#${bot.user.discriminator}</b><br>
    BOT kang tidur di Pois.<br>
    ma prefix is <code>'${bot.prefix}'</code>.<br>
    avail command [${Array.from(bot.commands.keys()).map(e=>"<code>'"+e+"'</code>").join(", ")}]<br>`
    return resp.send(`
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body{
          font-family: "Arial"
        }
      </style>
    </head>
    <body>
     <center>${description}</center>
    </body>
    `)
  });
})

bot.login(process.env._Token);

// eslint-disable-next-line no-console
process.on('unhandledRejection', console.error);