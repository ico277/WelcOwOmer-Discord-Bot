import * as discord from "discord.js";
import * as fs from "fs";
import * as db from "quick.db";

const setEmbeddedMessageColor = (color: string, embeddedMessage) => {
    if (color === "pink") { embeddedMessage.setColor(0xFFC0CB); }
    else if (color === "red") { embeddedMessage.setColor(0xFFC0CB); }
    else if (color === "blue") { embeddedMessage.setColor(0x0000FF); }
    else if (color === "light blue") { embeddedMessage.setColor(0x99CFE0); }
    else { embeddedMessage.setColor(0xFFC0CB); }
};

export class WelcOwOmerBot {
    public client:discord.Client;
    public PREFIX:string = "wl!";
    public DataBases:Map<string, db.table> = new Map<string, db.table>();

    constructor(token:string) {
        this.client = new discord.Client({disableMentions: "everyone"});
        this.DataBases.set("GuildsDb", new db.table("guilds"));

        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}\nowo`);
        })
        
        this.client.on("message", async (msg:discord.Message) => {
            if (msg.author.bot || !msg.content.startsWith(this.PREFIX)) {
                return;
            }
            let args = msg.content.split(" ");
            let cmd = args[0].substr(this.PREFIX.length);
            args.shift();
        
            var path = `./commands/${cmd}.js`.toLowerCase();
            if (fs.existsSync(path)) {
                var run = await require(path);
                if (run != null || run != undefined) {
                    try {
                        run.runCmd(msg, args, this.DataBases);
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
            //var path = `./guilds/${guild.id}.json`.toLowerCase();
            let GuildData = await (this.DataBases.get("GuildsDb")).get(guild.id);
            if (GuildData) {
                if (GuildData != null || GuildData != undefined && GuildData.welcome.enabled) {
                    let embed = new discord.MessageEmbed()
                        .setTitle("User joined!")
                        .setAuthor(member.user.tag, member.user.displayAvatarURL());
                    setEmbeddedMessageColor(GuildData.welcome.color, embed);
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
            //var path = `./guilds/${guild.id}.json`.toLowerCase();
            let GuildData = await (this.DataBases.get("GuildsDb")).get(guild.id);
            if (GuildData) {
                if (GuildData != null || GuildData != undefined && GuildData.bye.enabled) {
                    let embed = new discord.MessageEmbed()
                        .setTitle("User left!")
                        .setAuthor(member.user.tag, member.user.displayAvatarURL());
                    setEmbeddedMessageColor(GuildData.bye.color, embed);
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
