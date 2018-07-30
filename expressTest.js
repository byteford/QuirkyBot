const app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(reg,res){
    res.sendFile('/twitchdev/chat bot/git/http/streamoverlay.html');
});
io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('disconnect', function(socket){
        console.log('a user disconnected');
    });
    socket.on("setUp",function(){
        console.log('Set Up');
        socket.emit('hi','hello');
    });
});

http.listen(3000, function() { console.log('listening on port 3000!')});