module.exports = {
    users: [],

    user: function(username) {
        this.username = username;
        this.ID = _GenID();
        this.points = parseInt(0);
    },
    save: function() {
        fs.writeFile("Users.json", JSON.stringify(users), "utf8", onSave);
    },

    load: function() {
        users = require("./Users.json");
        console.log(users);
    },
    addCurrentUsers: function(username) {
        if (_containsUsername(currentUsers, username))
            return;
        currentUsers.push(_getUserUn(username));
    },
    removeCurrentUser: function(username) {
        if (containsUsername(currentUsers, username))
            currentUsers.pop(_getUserUn(username));
    },
    addUser: function(username) {
        if (_containsUsername(users, username))
            return;
        users.push(new user(username));
        console.log(username + ' is a new user');
        save();
    },
    containsUsername: function(a,username){
        return _containsUsername(a,username);        
    },
    getUserUn:function(username){
        return _getUserUn(username);
    }
    
}
var currentUsers = [];
function _onSave() {}
function _containsUsername(a, username) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].username === username) {
                return true;
            }
        }
        return false;
    }
    function _getUserUn(username){
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return users[i];
        }
    }
}
function _GenID(){
    return 'xxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}