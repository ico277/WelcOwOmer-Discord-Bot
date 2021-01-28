import { Message, MessageEmbed } from "discord.js";
import * as fs from "fs";
import { BOT_PREFIX, COLOR } from "../constants";

module.exports.runCmd = async function(msg:Message, args:string[]) {
    if (args.length > 0) {
        let cmd = args[0].toLowerCase();
        var path = `./${cmd}.js`.toLowerCase();
        if (fs.existsSync(`./commands/${cmd}.js`.toLowerCase())) {
            var CmdHelp = await require(path).help;
            if (CmdHelp != null || CmdHelp != undefined) {
                let embed = new MessageEmbed()
                    .setTitle(`${CmdHelp.name} help menu`)
                    .addField("Usage", CmdHelp.usage)
                    .addField("Description", CmdHelp.desc)
                    .setColor(COLOR["hot blue"]);
                if (CmdHelp.note) {
                    embed.addField("Note", CmdHelp.note);
                }
                msg.channel.send(embed);
            } else {
                msg.channel.send(`Could not find command "${cmd}"!`);
            }
        } else {
            msg.channel.send(`Could not find command "${cmd}"!`);
        }
    } else {

        const cmds: string = fs.readdirSync("./commands").map(cmd => {
            cmd.split(".")[0];
        }).sort().join(", ");

        let embed = new MessageEmbed()
            .setTitle("Help menu")
            .addField("All commands", cmds)
            .addField("Note", `For for information about a command do ${BOT_PREFIX}help [command name]`)
            .setFooter("<arg> means required argument\n[arg] means optional argument")
            .setColor(COLOR["hot blue"]);
        msg.channel.send(embed);
    }
}

module.exports.help = {
    name: "help",
    usage: `${BOT_PREFIX}help [command]`,
    desc: "It shows this help menu",
    note: null
}