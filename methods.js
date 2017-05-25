var constants = require('./constants.js');
var https = require('https');


function getAuthUrl(object) {
    return constants.vkAuthPath;
}

module.exports.getVKAuthPath = function (object) {
    return constants.vkAuthPath;
}


module.exports.getVKTokenPath = function (code) {
    return constants.vkTokenPath.replace('{code}', code);
}

module.exports.getVKGroupPath = function (id, token) {
    return constants.vkGroupsPath.replace('{id}', id).replace('{token}', token);
}

module.exports.getUserToken = function (url, response) {
    https.get(url, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            response.cookie(constants.cookieName, JSON.parse(data), { maxAge: constants.cookieLiveTime, httpOnly: true });
            response.redirect('/');
        });
        res.on('error', function (e) {
            console.log("Got error: " + e.message);
            response.end();
        });
    })
}

module.exports.getVKWallPath = function (id, token) {
    return constants.vkWallPath.replace('{id}', id).replace('{token}', token);
}

module.exports.convertVKWallData = function (obj) {
    var count = obj.response.items.length;
    var result = new Array();
    for (var i = 0; i < count;i++){
        result[i] = {
            date: new Date(obj.response.items[i].date * 1000),
            text: obj.response.items[i].text
        }
    }
    return result;
}