import {discord_client as client} from "./index.mjs";
import {getScreenshot, ResizeAndEncodeImageToWebp} from "./image.mjs";
import fetch from "node-fetch";

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
                // const url = attachment.url
                // const response = await fetch(url)
                // if(!response.ok){
                //     e.reply("画像のダウンロードに失敗しました")
                // }

                //const bufferData = new Buffer(await response.arrayBuffer())
                const bufferData = new Buffer(await getScreenshot(''))
                const d = await ResizeAndEncodeImageToWebp(bufferData)

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