//import Image from "./image";
//import Marked from "marked";

const Marked = require("marked")
const Image = require("./image")
const Router = require("koa-router")
const Koa = require("koa");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.OgpRouterSetup = ()=>{

    const app = new Koa()

    const router = new Router()

    router.get("/",(ctx)=>{
        ctx.body = ''
    })

    router.get("/ogp",async (ctx)=>{
        ctx.response.status = 200
        const discordURL = ctx.request.query['target']
        //console.log(discordURL)

        if(!discordURL){
            return
        }

        const matchedURL = String(discordURL).match('attachments\/(.*?).webp')

        if(matchedURL.length !== 2){
            return
        }

        const targetResponse = await fetch(`https://cdn.discordapp.com/${matchedURL[0]}`)

        if(!targetResponse.ok){
            //console.log(targetResponse.status)
            return
        }
        ctx.response.set("content-type", "image/webp");

        ctx.body = await (async ()=>{
            const ogpTitle = ctx.request.query['ogp_title']
            if(!ogpTitle){
                return await targetResponse.buffer()
            }

            const bufferData = await targetResponse.buffer()

            const d = await Image.ImageToWebp(await Image.getScreenshot(bufferData.toString('base64'),Marked.marked(ogpTitle)))

            return Buffer.from(d)
        })()
        //ctx.body = await targetResponse.buffer()
    })

    app.use(router.routes())
    app.listen(!!process.env.PORT ? process.env.PORT : 5000)
}
