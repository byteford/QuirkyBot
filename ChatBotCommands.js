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
function runCommand(target,context,msg){
        
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