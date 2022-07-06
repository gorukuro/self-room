const alowed_users = process.env.alowed_users? process.env.alowed_users.split("/") : ["598943183556313109"];

module.exports = (msg, bot) => {
  if(!alowed_users.includes(msg.author.id)) return;
  const args = msg.content.slice(bot.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const comid = bot.commands.get(commandName);
  if(comid){
    return comid.exec(msg, args, bot);
  }
}

