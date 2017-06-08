
'use strict';

const auth = require('./auth.js');
const show = require('./show.js');

module.exports={
    setVkAuthLink: auth.setVkAuthLink,
    renderGroupWallContent: show.renderGroupWallContent
}


