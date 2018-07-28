var rp = require('request-promise');
const TwitchWebhook = require('twitch-webhook')
var connectConfig = require('./connectConfig');

var twitchWebhook = new TwitchWebhook(connectConfig.webHoock);

module.exports = {
    GetStreamingState:function(){
    rp(connectConfig.htmlOptions)
    .then(function(resp){
        //console.log(resp);
        if(typeof resp.data[0] !== 'undefined'){
            _streamState = true;
            //console.log('live');
        }else{
            _streamState = false;
            //console.log('dead');
        }
    }).catch(function (err){
       console.log("Error: " + err);  
    });
},
    streamState: function(){
        return _streamState;
    },
    hoockSetUp: function(){
         
    // subscribe to topic
    twitchWebhook.subscribe('users/follows', {
    first: 1,
    from_id: 145762054 // ID of Twitch Channel ¯\_(ツ)_/¯
    })
    console.log("Hook connected");
    }
}
var _streamState = false;
// set listener for topic
twitchWebhook.on('users/follows', ({ event }) => {
    console.log(event)
})

 
// renew the subscription when it expires
twitchWebhook.on('unsubscibe', (obj) => {
  twitchWebhook.subscribe(obj['hub.topic'])
})
 
// tell Twitch that we no longer listen
// otherwise it will try to send events to a down app
process.on('SIGINT', () => {
  // unsubscribe from all topics
  twitchWebhook.unsubscribe('*')
 
  // or unsubscribe from each one individually
  twitchWebhook.unsubscribe('users/follows', {
    first: 1,
    to_id: 145762054
  })
})
 