var fs = require("fs");
const tmi = require('tmi.js');
var ConnectConfig = require('./connectConfig.js');
var rp = require('request-promise');
var users = []
var currentUsers = []
var addr;
var port;
var streamState = false;
var liveBeet;
var pointbeet;
console.log("start");
load();
console.log("file loaded");
let commandPrefix = '!'
//bot settings

//bot commands go here
let knownCommands = {
    //listAllUsers, 
    //listCurrentUsers, 
    getPoints,
    //givePoints,
    echo,
    //saveFile,
    help}

function listAllUsers(target, context, params){
    sendMessage(target, context, JSON.stringify(users));
}
function listCurrentUsers(target, context, params){
    sendMessage(target, context, JSON.stringify(currentUsers));
}

function getPoints(target, context, params){
        if(!containsUsername(users,params[0])){
        sendMessage(target,context,`unknown user: ${params[0]}`)
            console.log("unknown user: " + params[0]);
    }else{
        sendMessage(target,context,`${params[0]} has ${getUserUn(params[0]).points} points`)// "give " + params[0] + " points");
    
    }
}
function givePoints(target, context, params){
    if(!containsUsername(users,params[0])){
        sendMessage(target,context,`unknown user: ${params[0]}`)
            console.log("unknown user: " + params[0]);
    }else{
        giveUserPoints(getUserUn(params[0]),params[1]);
        //getUserUn(params[0]).points = parseInt(getUserUn(params[0]).points)+ parseInt(params[1]);
        sendMessage(target,context,`given ${params[0]} ${params[1]} points`)// "give " + params[0] + " points");
    
    }
}
function giveUserPoints(user, points){
    user.points = parseInt(user.points)+ parseInt(points)
}
function giveLivePoints(points){
    if(streamState == true)
        giveWatchersPoints(points);
}
function giveWatchersPoints(points){
        for (var i = 0; i < currentUsers.length; i++) {
            giveUserPoints(currentUsers[i],points); ;       
    }
    //console.log("make it rain");
}
function saveFile(){
    save();
}
function help(target, context, params){
    
}
// Function called when the "echo" command is issued:
function echo (target, context, params) {
  // If there's something to echo:
  if (params.length) {
    // Join the params into a string:
    const msg = params.join(' ')
    // Send it back to the correct place:
    sendMessage(target, context, msg)
  } else { // Nothing to echo
    console.log(`* Nothing to echo`)
  }
}
function sendMessage(target,context,message){
    if(context['message-type'] == 'whisper'){
        client.whisper(target,message);
    }else{
        client.say(target,message);
    }
}

//create a new client
let client = new tmi.client(ConnectConfig.opts);
//register our event handlers
client.on('message',onMessageHandler)
client.on('join',onUserJoin)
client.on('part',onUserPart)
client.on('connected',onConnectedHandler)
client.on('disconnected',noDissconnectedHandler)

client.connect();

console.log("channels " + client.readyState());
function onMessageHandler(target,context,msg,self){
    //if(self) {return} //ignore messages from bot
    
    //if the msg isnt a command)
    if(msg.substr(0,1)!=commandPrefix){
    console.log(`[${target}(${context['message-type']})]${context.username}: ${msg}`);
    return;
    }
    
    //split message in to individual workds
    const parse = msg.slice(1).split(' ');
    //the command name is the first one
    const commandName = parse[0];
    //the rest are the params
    const params = parse.splice(1);
    
    //if the the command is know, lets do it
    if(commandName in knownCommands){
        
        const command = knownCommands[commandName];
        command(target, context, params);
        console.log(`* Executed ${commandName} command for ${context.username}`)
    } else{
          console.log(`* Unknown command ${commandName} from ${context.username}`)  
        }
}
function onUserJoin(channel, username){
    console.log(username + ' joined');
    //save();
    addUser(username);
    addCurrentUsers(username);
    
}
function onUserPart(channel, username){
    console.log(username + ' left');
    removeCurrentUser(username);
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
function save(){
    fs.writeFile("Users.json",JSON.stringify(users),"utf8",onSave);
}
function onSave(){
}
function load(){
    users = require("./Users.json");
    console.log(users);
}
function addCurrentUsers(username){
    if(containsUsername(currentUsers,username))
        return;
    currentUsers.push(getUserUn(username));
}
function removeCurrentUser(username){
    if(containsUsername(currentUsers,username))
    currentUsers.pop(getUserUn(username));
}
function addUser(username){
    if(containsUsername(users, username))
        return ;
    users.push(new user(username));
    console.log(username + ' is a new user');
    save();
}
function getUserUn(username){
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return users[i];
        }
    }
}
function user(username){
    this.username = username;
    this.ID = GenID();
    this.points = parseInt(0);
}
function GenID() {
  return 'xxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function containsUsername(a, username) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].username === username) {
            return true;
        }
    }
    return false;
}
function GetStreamingState(){
    rp(ConnectConfig.htmlOptions)
    .then(function(resp){
        //console.log(resp);
        if(typeof resp.data[0] !== 'undefined'){
            streamState = true;
            console.log('live');
        }else{
            streamState = false;
            console.log('dead');
        }
    }).catch(function (err){
       console.log("Error: " + err);  
    });
}