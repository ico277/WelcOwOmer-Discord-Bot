import { Message, MessageEmbed } from "discord.js";
import * as db from "quick.db";

/**
 * Command class
 */
export default interface command {
    msg:Message,
    args:string[],
    DBs:Map<string, db.table>,
    help:Object
    run:Function
}



/*
public msg:Message;
public args:string[];
public DBs:Map<string, db.table>;
public help:Object = {
    name: " ",
    usage: "wl!",
    desc: " ",
    note: null
}


public run() {
}

constructor(msg:Message, args:string[], DBs:Map<string, db.table>) {
    this.msg = msg;
    this.args = args;
    this.DBs = DBs;
}*/