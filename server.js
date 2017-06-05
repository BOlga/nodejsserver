var express = require('express');
var https = require('https');
var cookieParser = require('cookie-parser');
var constants = require('./constants.js');
var methods = require('./methods.js');
var vk = require('./vk.js');
var hbs = require('hbs');

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

var app = express();
app.set('views', __dirname + '/views');
app.set("view engine", "hbs");
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());


app.use(function (request, response, next) {
    var cookie = request.cookies.VKUserData;
    if (cookie === undefined) {
        if (request.path == constants.authUrl) {
            next();
        }
        else {
            response.redirect(constants.authUrl);
        }
    }
    else {
        if (request.path == constants.showUrl) {
            next();
        }
        else {
            response.redirect(constants.showUrl);
        }
    }
})

app.get(constants.authUrl, function (request, response) {
    if (request.query.code) {
        var code = request.query.code;
        vk.getUserToken(code, methods.getFullPath(request), response);
    }
    else {
        var url = vk.getVKAuthPath(methods.getFullPath(request));
        response.render('auth', {
            vk_url: url,
            title: 'Авторизация'
        });
    }
})

app.get(constants.showUrl, function (request, response) {
    var cookie = request.cookies.VKUserData;
    vk.getUserGroupData(cookie)
        .then(result => {
            if(result){
               return  vk.getGroupWallData(result,cookie); 
            }
            return null;
            })
       .then(result => {
           if (result) {
                response.render("./show.hbs", {
                     title: result.group.name,
                     items: result.items 
                });
           }
           else { response.end(); }
       });
               
})

function run(port) {
    app.listen(port);
    console.log("Начало работы сервера. Порт " + port);
}


module.exports = {
    application: app,
    start:run
}



