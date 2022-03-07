import {getScreenshot, ImageToWebp, ResizeAndEncodeImageToWebp} from "./image.mjs";
import fetch from "node-fetch";

import {marked} from "marked";
import {Client, Intents} from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });

export const DiscordSetup = ()=>{
    client.once('ready',e=>{
        console.log("[Ready] Bot ready to command!");
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
                const response = await fetch(url)
                if(!response.ok){
                    e.reply("画像のダウンロードに失敗しました")
                }

                const bufferData = new Buffer(await response.arrayBuffer())

                let d = await ResizeAndEncodeImageToWebp(bufferData)

                e.reply("背景画像をWebpに変換中")

                if(e.content.length > 0){
                    e.reply("マークダウンを適用中")
                    d = await ImageToWebp(await getScreenshot(Buffer.from(d).toString('base64'),marked(e.content)))
                }

                e.reply("完成画像をWebpに変換中")
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
    client.login('OTQ5MjE5NTIzNjY2NTQyNTky.YiHLkg.c63DIPD3vQetA6JfeYPTy12F3xw')
}
