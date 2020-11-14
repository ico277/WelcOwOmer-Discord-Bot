import { DiscordAPIError, Message } from "discord.js";
import * as db from "quick.db"

/*export default class {
    private msg:Message;
    private args:string[];
    private DBs:Map<string, db.table>;

    public run() {
        this.msg.channel.send("hi!");
    }

    constructor(msg:Message, args:string[], DBs:Map<string, db.table>) {
        this.msg = msg;
        this.args = args;
        this.DBs = DBs;
    }
}*/

module.exports.runCmd = function(msg:Message, args:String[], DBs:Map<string, db.table>) {
    msg.channel.send("hi!");
}

module.exports.help = {
    name: "hi"
    //TODO add help object and command
}