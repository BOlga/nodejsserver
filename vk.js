let constants = require('./constants.js');
let secret = require('./vksecret.js');
let axios = require('axios');

module.exports.getVKAuthPath = function (red_url) {
    return constants.vkAuthPath.replace('{id}',secret.ID ).replace('{rUrl}',red_url);
}


module.exports.getUserToken = function (authcode, red_url, res) {
    axios.get(constants.vkTokenPath, {
        params: {
            client_id:secret.ID,
            client_secret:secret.CODE,
            redirect_uri: red_url,
            code:authcode
        }
    })
  .then(function (response) {
      let  data = response.data;
      res.cookie(constants.cookieName, data, { maxAge: constants.cookieLiveTime, httpOnly: true });
      res.redirect('/');
  })
  .catch(function (error) {
      console.log(error);
      res.end();
  });

}


module.exports.getUserGroupData = function(vkData){
    return axios.get(constants.vkGroupsPath, {
        params: {
            user_id: vkData.user_id,
            access_token:vkData.access_token,
            extended:1,
            count:1,
            v:'5.64'
        }
    })
   .then(function (response) {
       let data = response.data;
       let groupid = data.response.items[0].id;
       let groupName = data.response.items[0].name; 
       return { id: groupid, name: groupName }
   })
   .catch(function (error) {
       console.log(error);
       return null;
   });
}

module.exports.getGroupWallData = function(groupData,vkData){
    return axios.get(constants.vkWallPath, {
        params: {
            owner_id: -groupData.id,
            access_token: vkData.access_token,
            count: 5,
            v:'5.64'
        }
    })
   .then(function (response) {
       return {group: groupData, items: convertVKWallData(response.data)};
   })
   .catch(function (error) {
       console.log(error);
       return null;
   });
}

function convertVKWallData(obj) {
    var count = obj.response.items.length;
    var result = new Array();
    for (var i = 0; i < 1;i++){
        result[i] = {
            date: new Date(obj.response.items[i].date * 1000),
            text: obj.response.items[i].text
        }
        console.log(obj.response.items[i].attachments);
    }
    return result;
}