const express   = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
let connectionNum = 0;
let OPDate = [];
let hashName = new Array();
io.on('connection', (socket) => {
    connectionNum++;
    socket.on('connectNum',(name)=>{
        hashName[name] = socket;
        io.emit('connectNum',connectionNum);
    });
    socket.on('gamerData',(obj)=>{
        let isContain = false;
        for(let item = 0 ;item < OPDate.length;item++){
            if(OPDate[item].name === obj.name){
                OPDate[item] = obj;
                isContain = true;
                break;
            }
        }
        if(!isContain){OPDate.push(obj);}
        io.emit('OPData',OPDate);
    })
    socket.on("message", (obj) => {
        let returnData;
        let getTime = new Date();
        returnData = {
            name: obj.name,
            msg : obj.msg,
            time: getTime
        }
        if(obj.type === 'public'){
            io.emit("message", returnData);
        }else{
            let toSocket = hashName[obj.object];
            if(toSocket){
                toSocket.emit('message',returnData);
            }
        }
    });
    socket.on('disconnect',()=>{
        connectionNum--;
        io.emit('connectNum', connectionNum);
    });
});

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/search?q=%E3%80%90HD%E3%80%91UNNATURAL+-+%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB+-+Lemon%E3%80%90%E4%B8%AD%E6%97%A5%E5%AD%97%E5%B9%95%E3%80%91&tbm=isch');
    let body = await page.content()
    let $ = await cheerio.load(body)

    await browser.close();
})();

server.listen(8092);