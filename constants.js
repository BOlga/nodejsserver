var CookieLiveTime = 30000;
var VKAuthPath = 'https://oauth.vk.com/authorize?client_id=6045856&display=page&redirect_uri=http://localhost:3333/authorization&scope=262144&response_type=code&v=5.64'
var AuthUrl = '/authorization';
var ShowUrl = '/show';
var VKTokenPath = 'https://oauth.vk.com/access_token?client_id=6045856&client_secret=RgsMAaW3rPLru07Y5Y4N&redirect_uri=http://localhost:3333/authorization&code={code}'
var CookieName = 'VKUserData';
var VKGroupParh = 'https://api.vk.com/method/groups.get?user_id={id}&extended=1&count=1&v=5.64&access_token={token}';
var VKWallPath ='https://api.vk.com/method/wall.get?owner_id=-{id}&count=5&v=5.64&&access_token={token}';
module.exports = {
    cookieLiveTime: CookieLiveTime,
    cookieName: CookieName,
    vkAuthPath: VKAuthPath,
    vkGroupsPath:VKGroupParh,
    vkTokenPath: VKTokenPath,
    vkWallPath:VKWallPath,
    authUrl: AuthUrl,
    showUrl: ShowUrl
}