import { Message } from "discord.js";
import * as db from "quick.db"
import { BOT_PREFIX } from "../constants";

module.exports.runCmd = function(msg:Message, args:String[], DBs:Map<string, db.table>) {
    msg.channel.send("hi!");
}

module.exports.help = {
    name: "hi",
    usage: `${BOT_PREFIX}hi`,
    desc: "It greets you",
    note: null
}