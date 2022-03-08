const Sharp = require("sharp")

// import * as puppeteer from 'puppeteer'

const puppeteer = require("puppeteer")

// import twemoji from "twemoji";
// const twOptions = { folder: 'svg', ext: '.svg' };
// const emojify = (text) => twemoji.parse(text, twOptions);

let _page;


async function getPage() {
    if (_page) {
        return _page;
    }

    const browser = !!process.env.PORT ? await puppeteer.launch({
        args: [
            '--enable-font-antialiasing',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }) : await puppeteer.launch()

    _page = await browser.newPage();
    return _page;
}

exports.getScreenshot = async (backgroundBase64,markdown) => {
    const page = await getPage();
    await page.setViewport({ width: 700, height: 700 });
    await page.setContent(getHtml(backgroundBase64,markdown));
    const file = await page.screenshot();
    return file;
}

exports.getHtml = (backgroundBase64,markdown)=>{
    return `<html>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap" rel="stylesheet"/> 
    </head>
    <style>
        body{
            font-family: 'Open Sans', sans-serif;
        }
        p{
            padding:0;
            margin:0;
        }
        strong{
            font-weight: bold;
            font-family: "游明朝", YuMincho, "Hiragino Mincho ProN W3", "ヒラギノ明朝 ProN W3", "Hiragino Mincho ProN", "HG明朝E", "ＭＳ Ｐ明朝", "ＭＳ 明朝", serif;
            font-size: 75px;
        }
    </style>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <body style="margin:0;">
        <img style="position: relative;" src="data:image/webp;base64,${backgroundBase64}"/>
        <div style="
        width:700px;
        height:350px;
        position:absolute;
        top:175px;
        background-color:rgba(255, 255, 255, 0.473)">
            <div style="box-sizing:border-box;width:100%;height:100%;padding:10px 30px;display: flex;justify-content: center;align-items: center">
                <div style="font-size:50px;text-align: center;">
                    ${markdown}
                </div>
            </div>
        </div>
    </body>
</html>`;
}

exports.ImageToWebp = async(item)=>{
    const buf =  await Sharp(item)
        .webp({
            quality: 75
        })
        .toBuffer()

    return buf
}

exports.ResizeAndEncodeImageToWebp = async(item)=>{
    const buf =  await Sharp(item)
        .resize(700,700)
        .webp({
            quality: 75
        })
        .toBuffer()

    return buf
}
