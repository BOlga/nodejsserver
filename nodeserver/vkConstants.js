// eslint-disable-next-line max-len
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
