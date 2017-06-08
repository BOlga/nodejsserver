
'use strict';

const common = require('./common.js');

module.exports.setVkAuthLink = function (ctrl) {
    common.get({ type: 'vkLink', back: window.location.href })
            .then((data) => {
                const jData = JSON.parse(data);
    ctrl.setAttribute('href', jData.url);
});
}


module.exports.setVkAuthLink = function (ctrl) {
    common.get({ type: 'vkLink', back: window.location.href })
            .then((data) => {
                const jData = JSON.parse(data);
    ctrl.setAttribute('href', jData.url);
});
}
