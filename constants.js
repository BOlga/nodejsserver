const COOKIE_LIVETIME = 30000;
const COOKIE_NAME = 'VKUserData';
const AUTHURL = '/authorization';
const SHOWURL = '/show';

const VK_AUTH_PATH = 'https://oauth.vk.com/authorize?client_id={id}&display=page&redirect_uri={rUrl}&scope=262144&response_type=code&v=5.64';
const VK_TOKEN_PATH = 'https://oauth.vk.com/access_token';

const VK_GROUP_PATH = 'https://api.vk.com/method/groups.get';
const VK_WALL_PATH = 'https://api.vk.com/method/wall.get';

module.exports = {
    cookieLiveTime: COOKIE_LIVETIME,
    cookieName: COOKIE_NAME,
    vkAuthPath: VK_AUTH_PATH,
    vkGroupsPath:VK_GROUP_PATH,
    vkTokenPath: VK_TOKEN_PATH,
    vkWallPath:VK_WALL_PATH,
    authUrl: AUTHURL,
    showUrl: SHOWURL
}