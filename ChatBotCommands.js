var User = require('./user.js');
const tmi = require('tmi.js');
//bot commands go here
let knownCommands = {
    //listAllUsers, 
    //listCurrentUsers, 
    getPoints,
    //givePoints,
    echo,
    //saveFile,
    help}

function listAllUsers(target,context,params, client){
    sendMessage(target, context, JSON.stringify(users));
}
function listCurrentUsers(target,context,params, client){
    sendMessage(target, context, JSON.stringify(currentUsers), client);
}
function getPoints(target,context,params, client){
        if(!User.containsUsername(users,params[0])){
        sendMessage(target,context,`unknown user: ${params[0]}`)
            console.log("unknown user: " + params[0]);
    }else{
        sendMessage(target,context,`${params[0]} has ${User.getUserUn(params[0]).points} points`, client)// "give " + params[0] + " points");
    
    }
}
function givePoints(target,context,params, client){
    if(!User.containsUsername(users,params[0])){
        sendMessage(target,context,`unknown user: ${params[0]}`)
            console.log("unknown user: " + params[0]);
    }else{
        giveUserPoints(User.getUserUn(params[0]),params[1]);
        //getUserUn(params[0]).points = parseInt(getUserUn(params[0]).points)+ parseInt(params[1]);
        sendMessage(target,context,`given ${params[0]} ${params[1]} points`, client)// "give " + params[0] + " points");
    
    }
}
function giveUserPoints(user, points){
    user.points = parseInt(user.points)+ parseInt(points)
}

function saveFile(){
    save();
}
function help(target,context,params, client){
    
}
// Function called when the "echo" command is issued:
function echo (target,context,msg, client) {
  // If there's something to echo:
  if (params.length) {
    // Join the params into a string:
    const msg = params.join(' ')
    // Send it back to the correct place:
    sendMessage(target, context, msg, client)
  } else { // Nothing to echo
    console.log(`* Nothing to echo`)
  }
}
function sendMessage(target,context,msg, client){
    try{
        if(context['message-type'] == 'whisper'){
        client.whisper(target,msg);
    }else{
        client.say(target,msg);
    }
    }catch(err){
        console.log("error: " + err);
    }
}
module.exports ={
runCommand: function(target,context,msg, client){
    //split message in to individual workds
    const parse = msg.slice(1).split(' ');
    //the command name is the first one
    const commandName = parse[0];
    //the rest are the params
    const params = parse.splice(1);
    var isMod = context.mod;
    console.log("Mod: " + isMod);
    //if the the command is know, lets do it
    if(commandName in knownCommands){
        const command = knownCommands[commandName];
        command(target, context, params, client);
        console.log(`* Executed ${commandName} command for ${context.username}`)
    } else{
          console.log(`* Unknown command ${commandName} from ${context.username}`)  
        }
}
}