var fs = require("fs");
const tmi = require('tmi.js');
var connectConfig = require('./connectConfig.js');
var ChatBotCom = require('./ChatBotCommands.js');
var StreamApi = require('./StreamApi.js');
var User = require('./user.js');
const express = require('express');
const app = express();
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
app.use(express.static('http'))

function giveUserPoints(user, points){
    user.points = parseInt(user.points)+ parseInt(points)
}
function giveLivePoints(points){
    if(StreamApi.streamState() == true)
        giveWatchersPoints(points);
}
function giveWatchersPoints(points){
        for (var i = 0; i < User.currentUsers.length; i++) {
            giveUserPoints(User.currentUsers[i],points); ;       
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
app.listen(3000, () => console.log('listening on port 3000!'));
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
}
function noDissconnectedHandler(reason){
      console.log(`Womp womp, disconnected: ${reason}`)
    clearInterval(liveBeet);
}
function GetStreamingState(){
    StreamApi.GetStreamingState();
}

app.get('/', function(reg,res){
    res.sendFile('/twitchdev/chat bot/git/http/streamoverlay.html');
});
