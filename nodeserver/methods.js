'use strict';

const url = require('url');

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
