const express = require('express');
const cookieParser = require('cookie-parser');
const constants = require('./constants.js');
const methods = require('./methods.js');
const vk = require('./vk.js');
const hbs = require('hbs');

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

const app = express();
app.set('views', __dirname +'/views'); // eslint no-path-concat: 2
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public')); // eslint no-path-concat: 2
app.use(cookieParser());


app.use(function (request, response, next) {
    const cookie = request.cookies.VKUserData;
    if (cookie === undefined) {
        if (request.path === constants.authUrl) {
            next();
        }
        else {
            response.redirect(constants.authUrl);
        }
    }
    else {
        if (request.path === constants.showUrl) {
            next();
        }
        else {
            response.redirect(constants.showUrl);
        }
    }
})

app.get(constants.authUrl, function (request, response) {
    if (request.query.code) {
        let code = request.query.code;
        vk.getUserToken(code, methods.getFullPath(request), response);
    }
    else {
        let url = vk.getVKAuthPath(methods.getFullPath(request));
        response.render('auth', {
            vk_url: url,
            title: 'Авторизация'
        });
    }
})

app.get(constants.showUrl, function (request, response) {
    let cookie = request.cookies.VKUserData;
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



