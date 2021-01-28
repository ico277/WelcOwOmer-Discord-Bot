import * as discord from "discord.js";
import * as fs from "fs";
import * as db from "quick.db";
import { BOT_PREFIX, COLOR } from "./constants";

function setMessageEmbedColor (message: discord.MessageEmbed, color: string) {
    if (COLOR.hasOwnProperty(color)) { message.setColor(COLOR[color]); }
    else { message.setColor(COLOR["pink"]); }
};

export class WelcOwOmerBot {
    public client: discord.Client;
    public databases: Map<string, db.table> = new Map<string, db.table>();

    constructor(token:string) {
        this.client = new discord.Client({disableMentions: "everyone"});
        this.databases.set("GuildsDb", new db.table("guilds"));

        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}\nowo`);
        })
        
        this.client.on("message", async (msg:discord.Message) => {
            if (msg.author.bot || !msg.content.startsWith(BOT_PREFIX)) {
                return;
            }
            let args = msg.content.split(" ");
            let cmd = args[0].substr(BOT_PREFIX.length);
            args.shift();
        
            var path = `./commands/${cmd}.js`.toLowerCase();
            if (fs.existsSync(path)) {
                var run = await require(path);
                if (run != null || run != undefined) {
                    try {
                        run.runCmd(msg, args, this.databases);
                    } catch (ex) {
                        msg.channel.send(`There was an unexpected error!`);
                        console.error(ex);
                    }
                } else {
                    msg.channel.send(`Could not find command "${cmd}"!`);
                }
            } else {
                msg.channel.send(`Could not find command "${cmd}"!`);
            }
        })

        this.client.on("guildMemberAdd", async(member) => {
            console.log("gay")
            if (member.user.bot) {
                return;
            }
            let guild = member.guild;
            let GuildData = await (this.databases.get("GuildsDb")).get(guild.id);
            if (GuildData) {
                if (GuildData != null || GuildData != undefined && GuildData.welcome.enabled) {
                    let embed = new discord.MessageEmbed()
                        .setTitle("User joined!")
                        .setAuthor(member.user.tag, member.user.displayAvatarURL())
                        .setFooter(
                            `account created ${((Date.now() - member.user.createdTimestamp)/1000/60/60/24).toFixed(2)} days ago ` +
                            `(${((Date.now() - member.user.createdTimestamp)/1000/60/60).toFixed(2)} hours ago)`
                            );
                    setMessageEmbedColor(embed, GuildData.welcome.color);
                    if (GuildData.welcome.message) {
                        embed.setDescription(
                            GuildData.welcome.message
                            .replace("{user}", member.user.tag)
                            .replace("{guild}", guild.name)
                        )
                    } else {
                        embed.setDescription(`Welcome **${member.user.tag}** to **${guild.name}** ^w^`)
                    }
                    let channel = <discord.TextChannel> await this.client.channels.fetch(GuildData.welcome.channel);
                    if (channel) {
                        if (guild.id == "715519373619626107") {
                        channel.send("<@&766472750709473299>", embed);
                       } else {
                        channel.send(embed);
                       }
                    }
                }
            }
        })
        
        this.client.on("guildMemberRemove", async(member) => {
            if (member.user.bot) {
                return;
            }
            let guild = member.guild;
            let GuildData = await (this.databases.get("GuildsDb")).get(guild.id);
            if (GuildData) {
                if (GuildData != null || GuildData != undefined && GuildData.bye.enabled) {
                    let embed = new discord.MessageEmbed()
                        .setTitle("User left!")
                        .setAuthor(member.user.tag, member.user.displayAvatarURL());
                    setMessageEmbedColor(embed, GuildData.bye.color);
                    if (GuildData.bye.message) {
                        embed.setDescription(
                            GuildData.bye.message
                            .replace("{user}", member.user.tag)
                            .replace("{guild}", guild.name)
                        )
                    } else {
                        embed.setDescription(`**${member.user.tag}** left the server qwq`);
                    }
                    let channel = <discord.TextChannel> await this.client.channels.fetch(GuildData.bye.channel);
                    if (channel) {
                        channel.send(embed);
                    }
                }
            }
        })

        this.client.login(token);
    }
}
