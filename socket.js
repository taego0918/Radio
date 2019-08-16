const express   = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
let connectionNum = 0;
let OPDate = [];
let bootTime = new Date();
let videoList = [
        { video_id: '4z9o8GwxBz8', user: 'TaeGo', second: 279.001 },
        { video_id: 'NrHRTNeni-U', user: 'TaeGo', second: 253.021 },
        { video_id: 'Gp6XKEE8B2E', user: 'TaeGo', second: 209.821 },
        { video_id: 'ostW9oAsO24', user: 'TaeGo', second: 251.861 },
    ];

    Date.prototype.addSecond = function(second) {
        var dat = new Date(this.valueOf());
        dat.setSeconds(dat.getSeconds() + second);
        return dat
    }
let CumulativeTime = bootTime
for(let item = 0; item < videoList.length; item++){
    CumulativeTime = CumulativeTime.addSecond(videoList[item].second);
    videoList[item].endTime = CumulativeTime;
}

let hashName = new Array();
io.on('connection', (socket) => {
    connectionNum++;
    socket.on('connectNum',(name)=>{
        hashName[name] = socket;
        io.emit('connectNum',connectionNum);
        let data = [];
        let getTime = new Date();

        for(let item = 0; item < videoList.length; item++){
            if(getTime < videoList[item].endTime ){
                data.push(videoList[item]);
            }
        }
        socket.emit('videoList',data);
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
        let data = obj;
        let getTime = new Date();
        data.endTime = getTime.addSecond(obj.second);
        io.emit('videoList',[data]);
        videoList.push(data);
    });
});

server.listen(8092);