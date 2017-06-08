'use strict';

const methods = require('../nodeserver/methods.js');

module.exports.get = function (params) {
      const url = `${window.location.protocol}//${window.location.host}/ajax`;
      return methods.getSimple(url, params);
}


module.exports.convertDate = function (date){
    return methods.convertDate(date);
}


