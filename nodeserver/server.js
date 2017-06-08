const express = require('express');
const cookieParser = require('cookie-parser');
const constants = require('./constants.js');
const vk = require('./vk.js');
const path = require('path');
const log4js = require('log4js');


const app = express();
app.use(express.static(path.join(__dirname,'..', 'public')));
app.use(cookieParser());

const logger = log4js.getLogger();


app.use((request, response, next) => {
  if (request.path === constants.requestUrl) {
    next();
  } else {
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
  }
});

app.get(constants.authUrl, (request, response) => {
  if (request.query.code) {
    const code = request.query.code;
    vk.getUserToken(code, request, response);
  } else {
    response.sendFile(path.join(__dirname, '..', 'public', 'auth.html'));
  }
});

app.get(constants.requestUrl, (request, response) => {
  logger.debug(`Getting data ${request.url}`);
  const cookie = request.cookies.VKUserData;
  if (request.query.type === 'vkLink') {
    response.send({ url: vk.getVKAuthPath(request.query.back, request) });
  }
  if (request.query.type === 'vkGroupData') {
    vk.getUserGroupData(cookie)
           .then((result) => {
             if (result) {
               response.send(result);
             } else { response.send({}); }
           });
  }
  if (request.query.type === 'vkWallData') {
    vk.getGroupWallData({ id: request.query.group, name: '' }, cookie).then((result) => {
      if (result) {
        response.send({
          title: result.group.name,
          items: result.items,
        });
      } else { response.send({}); }
    });
  }

  if (request.query.type === 'vkGroupWallData') {
    vk.getUserGroupData(cookie)
           .then((result) => {
             if (result) {
               return vk.getGroupWallData(result, cookie);
             }
             return null;
           })
           .then((result) => {
             if (result) {
               response.send({
                 title: result.group.name,
                 items: result.items,
               });
             } else { response.send({}); }
           });
  }
});


app.get(constants.showUrl, (request, response) => {
  response.sendFile(path.join(__dirname, '..', 'public', 'show.html'));
});


function run(port) {
  app.listen(port);
  logger.trace(`Начало работы сервера. Порт ${port}`);
}


module.exports = {
  application: app,
  start: run,
};

