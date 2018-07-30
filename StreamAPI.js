var rp = require('request-promise');
var connectConfig = require('./connectConfig');


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

}
var _streamState = false;

 