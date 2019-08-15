const express   = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
let connectionNum = 0;
let OPDate = [];
let videoList = [
        {video_id: '4z9o8GwxBz8', user:'TaeGo'},
        // {video_id: 'NrHRTNeni-U', user:'TaeGo'}
    ];
let hashName = new Array();
io.on('connection', (socket) => {
    connectionNum++;
    socket.on('connectNum',(name)=>{
        hashName[name] = socket;
        io.emit('connectNum',connectionNum);
        io.emit('videoList',videoList);
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
        io.emit("message", returnData);
    });
    socket.on('disconnect',()=>{
        connectionNum--;
        io.emit('connectNum', connectionNum);
    });
    socket.on('addSong',(obj)=>{
        io.emit('videoList',[obj]);
    });
});

server.listen(8092);