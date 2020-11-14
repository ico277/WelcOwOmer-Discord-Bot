import { DiscordAPIError, Message } from "discord.js";
import * as db from "quick.db"

module.exports.runCmd = async function(msg:Message, args:String[], DBs:Map<string, db.table>) {
	var GuildsDb = DBs.get("GuildsDb");
    let data = await GuildsDb.get(msg.guild.id);
    if (data == null || !data) {
        msg.channel.send("This server hasn't been set up yet! Do wl!setup to set this server up");
    } else {
        if (args.length > 0) {
			
        }
    }
}

module.exports.help = {
    name: "Welcome Message"
    //TODO add help object and command
}