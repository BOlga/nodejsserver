const express = require('express');
const cookieParser = require('cookie-parser');
const constants = require('./constants.js');
const methods = require('./methods.js');
const vk = require('./vk.js');
const hbs = require('hbs');
const log4js = require('log4js');
const path = require('path');

const app = express();
app.set('views', path.join(__dirname, '..', '/views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '..', '/public')));
app.use(cookieParser());

const logger = log4js.getLogger();
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

app.use((request, response, next) => {
  const cookie = request.cookies.VKUserData;
  if (cookie === undefined) {
    if (request.path === constants.authUrl) {
      next();
    } else {
      response.redirect(constants.authUrl);
    }
  } else if (request.path === constants.showUrl) {
    next();
  } else {
    response.redirect(constants.showUrl);
  }
});

app.get(constants.authUrl, (request, response) => {
  if (request.query.code) {
    const code = request.query.code;
    vk.getUserToken(code, request, response);
  } else {
    logger.info('Unauthorized access');
    const url = vk.getVKAuthPath(methods.getFullPath(request));
    response.render('auth', {
      vk_url: url,
      title: 'Авторизация',
    });
  }
});

app.get(constants.showUrl, (request, response) => {
  const cookie = request.cookies.VKUserData;
  vk.getUserGroupData(cookie)
        .then((result) => {
          if (result) {
            return vk.getGroupWallData(result, cookie);
          }
          return null;
        })
       .then((result) => {
         if (result) {
           response.render('./show.hbs', {
             title: result.group.name,
             items: result.items,
           });
         } else { response.end(); }
       });
});

function run(port) {
  app.listen(port);
  console.log(`Начало работы сервера. Порт ${port}`); // eslint-disable-line no-console
}


module.exports = {
  application: app,
  start: run,
};

