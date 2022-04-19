//import {getScreenshot, ImageToWebp, ResizeAndEncodeImageToWebp} from "./image.js";
//import fetch from "node-fetch";

//import {marked} from "marked";
// import {Client, Intents} from "discord_bot.js";


const Image = require("./image")
const Marked = require('marked');
const Discord = require('discord.js');
const Fetch = require("node-fetch")

exports.DiscordSetup = function(){

    const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES] });

    client.once('ready',e=>{
        console.log("[Ready] Bot ready to command!");
    })

    client.on('messageCreate',async e=>{
        if(e.author.bot){
            return
        }
        if(e.mentions.has(client.user) && e.content.includes(".rebuild")){
            e.reply("リビルドします")


            const r = await Fetch(`https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/${ !!process.env.CLOUD_FLARE_KEY ? process.env.CLOUD_FLARE_KEY : '' }`,
                {
                    method: 'POST'
                })

            if(r.ok){
                e.reply("実行中です")
            }else{
                e.reply("コマンドの実行に失敗しました")
            }
        }
    })

    client.on('messageCreate',async e=>{

        if (e.author.bot){
            return;
        }

        e.attachments.forEach(attachment=>{
            //画像でない場合はここで追い返される
            if(!attachment.width || !attachment.height){
                return
            }
            (async ()=>{
                const url = attachment.url
                const response = await Fetch(url)
                if(!response.ok){
                    e.reply("画像のダウンロードに失敗しました")
                }

                const bufferData = new Buffer(await response.arrayBuffer())

                let d = await Image.ResizeAndEncodeImageToWebp(bufferData)

                await e.reply("背景画像をWebpに変換中")

                await e.reply({files:[{
                        attachment: Buffer.from(d),
                        name: attachment.name.substring(0, attachment.name.lastIndexOf("."))+'.webp',
                    }]})

                if(e.content.length > 0){
                    await e.reply("マークダウンを適用中")
                    d = await Image.ImageToWebp(await Image.getScreenshot(Buffer.from(d).toString('base64'),Marked.marked(e.content)))
                }

                await e.reply("完成画像をWebpに変換中")
                const convertedBufferData = Buffer.from(d)

                const sendOption = {
                    files:[
                        {
                            attachment: convertedBufferData,
                            name: attachment.name.substring(0, attachment.name.lastIndexOf("."))+'.webp',
                        }
                    ]
                }

                if(e.content.length > 0){
                    sendOption.content = e.content
                }

                const r = await e.reply(sendOption)
            })()
        })
    })
    client.login(!!process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : '')
}
