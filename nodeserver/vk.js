const constants = require('./constants.js');
const vkConstants = require('./vkConstants.js');
const secret = require('./vksecret.js');
const methods = require('./methods.js');
const axios = require('axios');
const log4js = require('log4js');

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

