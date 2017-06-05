let url = require('url');

module.exports.getFullPath = function (request) {   
    return request.protocol + '://' + request.get('host') + url.parse(request.url, true).pathname;
}
