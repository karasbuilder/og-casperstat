
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest, IRenderContent, IRenderWithTitle, IRenderWithContentDetail } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string) {
    let background = 'white';
    let foreground = 'black';

    if (theme === 'dark') {
        background = '#262938';
        foreground = '#FFFFFF';
    }

    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    * {
        margin: 0;
    }

    body {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 48px;
        background: ${background};
        font-family: 'Inter', sans-serif;
        font-style: normal;
        letter-spacing: -0.01em;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .header {
       display:flex;
       align-items:center;
       justify-content:space-between;
    }

    .header .details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: ${foreground};
        overflow: hidden;
    }

    .header .details .logo {
         margin-right: 32px;
         color:${foreground};
    }
    .header .detai.avatar{

    }
    .header  .title{
        color:${foreground};
        display:flex;
        align-items:center;
        justify-content:end;
        
    }
  

    .main {
        padding: 40px;
        padding-bottom: 32px;
        background: ${theme === "dark" ? "#1C1F2E" : "rgba(230, 232, 248, 0.6)"};
        margin: auto 0;
        width: fit-content;
        min-width:80%;
        border-radius: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .main .title {
        font-weight: 500;
        font-size: 32px;
        color: ${theme === "dark" ? "#777B92" : "#8C90B0"};
    }

    .main .content {
        margin-top: 44px;
        display: flex;
        align-items: baseline;
        font-size:24px;
        color :${foreground};
    }
    .center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header.center {
        justify-content: space-between;
    }

    .font-40px {
        font-size: 40px !important;
    }
    
    .footer {
        font-style: italic;
        font-weight: normal;
        font-size: 24px;
        color: ${theme === "dark" ? "rgba(149, 153, 171, 0.9)" : "#575A68"};
        margin-bottom: -16px;
        
       
    }
    

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
        color: ${theme === "dark" ? "white" : "#575A68"};
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { cardName, footerURL, theme, contentType, content, md, images,nameDetail } = parsedReq;


    return `<!DOCTYPE html>
            <html>
                <meta charset="utf-8">
                <title>Generated Image</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    ${getCss(theme)}
                </style>
                <body>
                ${renderContent({ cardName, images, content, md, contentType ,nameDetail})}
                    <div class="footer">                     
                        ${emojify(
                            md ? marked(footerURL) : sanitizeHtml(footerURL || "https://casperstats.io/")
                        )}
                    </div>
                </body>
            </html>`;
}

function getImage(src: string, height = '80', className = 'logo') {
    return `<img
        class="${sanitizeHtml(className)}"
        src="${sanitizeHtml(src)}"
        width="auto"
        height="${sanitizeHtml(height)}"
        onerror="this.onerror=null; this.remove();"
    />`
}
//render with default , block , validators
function renderContent({ cardName, images, content, md, contentType ,nameDetail}: IRenderContent) {
    if (!cardName || contentType =="default") {
        return renderOnlyLogo(images[0])
    } else if (contentType =='content') {
        return renderWithTitle({ cardName, images, content, md });
    } else {
        return renderWithContentDetail({ cardName, images, content, md ,nameDetail});
    }

}
function renderOnlyLogo(image: string) {
    return `
    <div class="center">
                ${getImage(image, "120", "logo")}
            </div>`
}

function renderWithTitle({ cardName, images, content, md }: IRenderWithTitle) {
    return `
    <div class="header">
        <div class="details">
            ${getImage(images[0], '80', "logo")}
        </div>     
    </div>
    <div class="main">
        <div class="title">
            ${md ? marked(cardName) : sanitizeHtml(cardName)}
        </div>
        <div class="content font-40px">
            ${sanitizeHtml(content)}
        </div>
    </div
    `;
}

function renderWithContentDetail({ cardName, images, content, md,nameDetail}: IRenderWithContentDetail) {
    return `
            <div class="header">
            <div class="details">
            ${getImage(images[0], '80', "logo")}      
        </div>     
         <div class="title">
            ${sanitizeHtml(nameDetail)}
            ${getImage(images[1], '80', 'avatar')}
            </div> 
        </div>
        <div class="main"> 
        <div class="title">
        ${md ? marked(cardName) : sanitizeHtml(cardName)}
        </div>
        <div class="content font-40px">
        ${content}
        </div>
        </div>
    `
}