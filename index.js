var fs = require("fs");
const tmi = require('tmi.js');
var connectConfig = require('./connectConfig.js');
var ChatBotCom = require('./ChatBotCommands.js');
var StreamApi = require('./StreamAPI.js');
var User = require('./user.js');
const app = require('express')();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rp = require('request-promise');
//var users = []
//var currentUsers = []
var addr;
var port;

var liveBeet;
var pointbeet;
console.log("start");
User.load();
console.log("file loaded");
let commandPrefix = '!'

function giveUserPoints(user, points){
    user.points = parseInt(user.points)+ parseInt(points)
}
function giveLivePoints(points){
    if(StreamApi.streamState() == true)
        giveWatchersPoints(points);
}
function giveWatchersPoints(points){
        for (var i = 0; i < User.getConnectedUsers.length; i++) {
            giveUserPoints(User.getConnectedUsers[i],points); ;       
    }
    //console.log("make it rain");
}
//create a new client
let client = new tmi.client(connectConfig.opts);
//register our event handlers
client.on('message',onMessageHandler)
client.on('join',onUserJoin)
client.on('part',onUserPart)
client.on('connected',onConnectedHandler)
client.on('disconnected',noDissconnectedHandler)

client.connect();
http.listen(3000, function(){console.log('listening on port 3000!')});
console.log("channels " + client.readyState());
//target - name of the channel to connect to
function onMessageHandler(target,context,msg,self){
    //if(self) {return} //ignore messages from bot
    
    //if the msg isnt a command)
    if(msg.substr(0,1)!=commandPrefix){
    console.log(`[${target}(${context['message-type']})]${context.username}: ${msg}`);
    return;
    }

    ChatBotCom.runCommand(target,context,msg, client);
}
function onUserJoin(channel, username){
    console.log(username + ' joined');
    //save();
    User.addUser(username);
    User.addCurrentUsers(username);
    io.emit('loadPlayer',User.getUserUn(username));
    
}
function onUserPart(channel, username){
    console.log(username + ' left');
    User.removeCurrentUser(username);
}
function onConnectedHandler(addr, port){
    console.log("channels " + client.readyState());
    console.log("channels " + client.getChannels());
    GetStreamingState();
    liveBeet = setInterval(GetStreamingState,120000);
    pointbeet = setInterval(giveLivePoints,600000,1);
    rp(connectConfig.followerHookOptions).then(function(resp){
        console.log(resp);
        
    }).catch(function (err){
       console.log("Error: " + err);  
    });
    
    
}
function noDissconnectedHandler(reason){
      console.log(`Womp womp, disconnected: ${reason}`)
    clearInterval(liveBeet);
}
function GetStreamingState(){
   StreamApi.GetStreamingState();
}
function StartTwitchWebHooks(){
    
}
app.get('/api/follower',function(reg,res){
    //console.log(res.socket.parser.incoming.query['hub.challenge']);
    //console.log(res.query['hub.challenge']);
    //res.send(res.socket.parser.incoming.query['hub.challenge']);
    res.send(reg.params['hub.challenge']);
    res.statusCode = 200;
});
app.post('/api/follower',function(reg,res){
    res.statusCode = 200;
    console.log(reg.body.data);
    console.log(reg.body.data['0'].from_id);
     rp(
     {
         url:'https://api.twitch.tv/helix/users',
         qs: {
             'id': reg.body.data['0'].from_id
         },
         headers: {
            'Client-ID': '9fhlxcfombc0k7v9obeqm0kna5g7yq'
        },
        json: true
     }
     ).then(function(resp){
         console.log(resp.data[0].login + " has followed");
     }).catch(function(err){
        console.log("Error: " + err); 
     });
    res.send();
});

app.get('/', function(reg,res){
    res.sendFile('/twitchdev/chat bot/git/http/streamoverlay.html');
});
io.on('connection',function(socket){
    console.log('a user connected IO');
    
    socket.on('disconnect', function(socket){
        console.log('a user disconnected IO');
    });
    socket.on("setUp",function(){
        console.log('Set Up');
        socket.emit('loadAllPlayers',User.getConnectedUsers());
    });
});
