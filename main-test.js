const _ = require('lodash');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('test-data/log.json', 'utf8'));
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

setInterval(broadcastInfo,1000)
function broadcastInfo() {
  io.emit('gps', obj[i]);
  i++;
  if (i> obj.length) {
    i = 0;
  }
}