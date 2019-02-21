const _ = require('lodash');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('flight-log.json', 'utf8'));
let i = 0;
app.get('/', function(req, res){
  res.sendFile(__dirname+'/web/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

setupPlayback();

function setupPlayback(){
  let sortingArray = [
    {type:'gps', time: obj['gps'][0].time},
    {type:'attitude',time:obj['attitude'][0].time},
    {type:'link',time:obj['link'][0].time},
    {type:'battery',time:obj['battery'][0].time}];
  sortingArray.sort(compare);
  playBack(sortingArray[0].type);
  for(let i=1;i<sortingArray.length; i++) {
    setTimeout(()=>{
      playBack(sortingArray[i].type);
    },((sortingArray[i].time-sortingArray[0].time)*1))
  }
}

function compare(a,b) {
  if (a.time < b.time)
    return -1;
  if (a.time > b.time)
    return 1;
  return 0;
}



function playBack(type){
  let log = obj[type];
  const baseTime = log[0].time;
  broadcast(type,log[0]);
  for(let i=1; i<log.length; i++){
    setTimeout(()=>{
      broadcast(type,log[i]);
    },((log[i].time-baseTime)*1));
  }
}

function broadcast(type,info) {
  io.emit(type, info);
  // console.log('broadcasting',type);
}