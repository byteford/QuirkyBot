let opts = {
    identity: {
        username: 'USERNAME',
        password: 'OARTH KEY'
    },
    channels:[
        'CHANNEL TO JOIN'
    ]
}
module.exports = {
    htmlOptions: {
    uri: 'https://api.twitch.tv/helix/streams',
    qs:{
        'user_login':'CHANNEL TO WATCH'
    },
    headers:{
        'Client-ID': 'CLIENTID'
    },
    json: true  
}
    
};