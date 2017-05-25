var express = require('express');
var https = require('https');
var cookieParser = require('cookie-parser');
var constants = require('./constants.js');
var methods = require('./methods.js');
var hbs = require('hbs');
var fs = require("fs");

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

var app = express();
app.set("view engine", "hbs");
app.use(cookieParser());


app.use(function(request, response, next){
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
    if (request.param('code')) {
        var code = request.param('code');
        var url = methods.getVKTokenPath(code);
        methods.getUserToken(url, response);
    }
    else {
        fs.readFile("./views/auth.html", "utf8", function (error, data) {
            var url = methods.getVKAuthPath();
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(data.replace("{url}", url));
            response.end();
        });
    }
})

app.get(constants.showUrl, function (request, response) {
    var cookie = request.cookies.VKUserData;
    var url = methods.getVKGroupPath(cookie.user_id, cookie.access_token);
    https.get(url, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {            
            var jData = JSON.parse(data);
            var groupid = jData.response.items[0].id;
            var groupName = jData.response.items[0].name;            
            var wallUrl = methods.getVKWallPath(groupid, cookie.access_token);

            https.get(wallUrl, function (resp) {
                resp.setEncoding('utf8');
                var respContent = '';
                resp.on('data', function (data) {
                    respContent += data;                    
                });
                res.on('error', function (e) {
                    console.log("Got error: " + e.message);
                    response.end();
                });
                resp.on('end', function () {
                    var jData = JSON.parse(respContent);
                    response.render("./show.hbs", {
                        title: groupName,
                        items: methods.convertVKWallData(jData)
                    });
                });

            })
        });
        res.on('error', function (e) {
            console.log("Got error: " + e.message);
            response.end();
        });
    })
})





app.listen(3333);
console.log("Начало работы сервера. Порт 3333");


