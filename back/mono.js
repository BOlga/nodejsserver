var mono =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const COOKIE_LIVETIME = 60000;
const COOKIE_NAME = 'VKUserData';
const AUTHURL = '/authorization';
const SHOWURL = '/show';
const REQUESTURL = '/ajax';


module.exports = {
  cookieLiveTime: COOKIE_LIVETIME,
  cookieName: COOKIE_NAME,
  authUrl: AUTHURL,
  requestUrl: REQUESTURL,
  showUrl: SHOWURL,
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("log4js");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const url = __webpack_require__(10);

module.exports.getFullPath = function (request) {
  return `${request.protocol}://${request.get('host')}${url.parse(request.url, true).pathname}`;
  }

module.exports.convertDate = function (odate) {
    const date = new Date(odate);
    return date.toLocaleString('ru-Ru', { year: 'numeric', month: 'long', day: 'numeric' });
}


module.exports.computeGetUrl = function (url, params) {
    if (!params) {
        return url;
    }
    let result = `${url}?`;
    Object.keys(params).forEach((key) => {
        result += `${key}=${params[key]}&`;
});

return result;
}


module.exports.getSimple = function (url, params) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest(); // eslint-disable-line no-undef
    req.open('GET', this.computeGetUrl(url, params));
    req.onload = () => (req.status === 200 ? resolve(req.response) : reject(Error(req.statusText)));
    req.onerror = e => (reject(Error(`Network Error: ${e}`)));
    req.send();
});
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const constants = __webpack_require__(0);
const vkConstants = __webpack_require__(7);
const secret = __webpack_require__(8);
const methods = __webpack_require__(2);
const axios = __webpack_require__(9);
const log4js = __webpack_require__(1);

const logger = log4js.getLogger();


function convertVKWallData(obj) {
  const count = obj.response.items.length;
  const result = [];
  for (let i = 0; i < count; i++) {
    result[i] = {
      date: new Date(obj.response.items[i].date * 1000),
      text: obj.response.items[i].text,
    };
  }
  return result;
}

module.exports.getVKAuthPath = function (url, request) {
  let redUrl = url;
  if (!redUrl) {
    redUrl = methods.getFullPath(request);
  }
  return vkConstants.vkAuthPath.replace('{id}', secret.ID).replace('{rUrl}', redUrl);
};


module.exports.getUserToken = function (authcode, req, res) {
  logger.debug('Getting user token');
    axios.get(vkConstants.vkTokenPath, {
    params: {
      client_id: secret.ID,
      client_secret: secret.CODE,
      redirect_uri: methods.getFullPath(req),
      code: authcode,
    },
  })
  .then((response) => {
    const data = response.data;
    res.cookie(constants.cookieName, data, { maxAge: constants.cookieLiveTime, httpOnly: true });
    res.redirect('/');
  })
  .catch((error) => {
    logger.error(error);
    res.end();
  });
};


module.exports.getUserGroupData = function (vkData) {
  logger.debug('Getting user group data');
  return axios.get(vkConstants.vkGroupsPath, {
    params: {
      user_id: vkData.user_id,
      access_token: vkData.access_token,
      extended: 1,
      count: 1,
      v: '5.64',
    },
  })
   .then((response) => {
     const data = response.data;
     const groupid = data.response.items[0].id;
     const groupName = data.response.items[0].name;
     return { id: groupid, name: groupName };
   })
   .catch((error) => {
     logger.error(error);
     return null;
   });
};

module.exports.getGroupWallData = function (groupData, vkData) {
  logger.debug('Getting user group wall data');
  return axios.get(vkConstants.vkWallPath, {
    params: {
      owner_id: -groupData.id,
      access_token: vkData.access_token,
      count: 5,
      v: '5.64',
    },
  })
   .then(response => ({ group: groupData, items: convertVKWallData(response.data) }))
   .catch((error) => {
     logger.error(error);
     return null;
   });
};



/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

﻿// eslint-disable-next-line max-len
const VK_AUTH_PATH = 'https://oauth.vk.com/authorize?client_id={id}&display=page&redirect_uri={rUrl}&scope=262144&response_type=code&v=5.64';
const VK_TOKEN_PATH = 'https://oauth.vk.com/access_token';

const VK_GROUP_PATH = 'https://api.vk.com/method/groups.get';
const VK_WALL_PATH = 'https://api.vk.com/method/wall.get';



module.exports = {
    vkAuthPath: VK_AUTH_PATH,
    vkGroupsPath: VK_GROUP_PATH,
    vkTokenPath: VK_TOKEN_PATH,
    vkWallPath: VK_WALL_PATH,   
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {


module.exports = {
  ID: '6045856',
  CODE: 'RgsMAaW3rPLru07Y5Y4N',
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("handlebars-dateformat");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("hbs");

/***/ }),
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const express = __webpack_require__(5);
const cookieParser = __webpack_require__(4);
const constants = __webpack_require__(0);
const methods = __webpack_require__(2);
const vk = __webpack_require__(3);
const hbs = __webpack_require__(12);
const log4js = __webpack_require__(1);
const path = __webpack_require__(6);

const app = express();
app.set('views', path.join(__dirname, '..', '/views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '..', '/public')));
app.use(cookieParser());

const logger = log4js.getLogger();
hbs.registerHelper('dateFormat', __webpack_require__(11));

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


/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ })
/******/ ]);