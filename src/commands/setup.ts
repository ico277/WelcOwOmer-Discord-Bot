import { Message } from "discord.js";
import * as db from "quick.db"
import { BOT_PREFIX } from "../constants";

module.exports.runCmd = async function(msg:Message, args:String[], DBs:Map<string, db.table>) {
    var GuildsDb = DBs.get("GuildsDb");
    let data = await GuildsDb.get(msg.guild.id);
    if (data == null || !data) {
        let mentions = msg.mentions.channels.array();
        if (mentions.length == 2) {
            if (msg.member.hasPermission("MANAGE_CHANNELS")) {
                let msg2delete = await msg.channel.send("Settings this server up...");
                let WelcomeChannel = mentions[0];
                let ByeChannel = mentions[1];
                
                await GuildsDb.set(msg.guild.id, {
                    "welcome": {
                        "enabled": true,
                        "channel": WelcomeChannel.id,
                        "message": null,
                        "color": "pink"
                    },
                    "bye": {
                        "enabled": true,
                        "channel": ByeChannel.id,
                        "message": null,
                        "color": "pink"
                    }
                })
                msg.channel.send(`Set <#${WelcomeChannel.id}> as the welcome channel\nSet <#${ByeChannel.id}> as the leave channel`)
                msg2delete.delete();
            } else {
                msg.reply("you don't permissions so use this command!")
            }
        } else {
            msg.reply("You have to mention 2 channels in this order: @welcome-channel @leave-channel!")
        }
    } else {
        msg.reply("Already set up? If you want to reset, do wl!reset")
    }
}

module.exports.help = {
    name: "setup",
    usage: `${BOT_PREFIX}setup`,
    desc: "This command sets the server up for the welcome-ing",
    note: "W.I.P command"
}