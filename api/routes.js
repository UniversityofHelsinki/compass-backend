require('dotenv').config();

const dbApi = require('../api/dbApi');
const userApi = require("../api/userApi");

module.exports = function (router) {
    router.get('/hello', dbApi.getHelloFromDb);
    router.get('/user', userApi.getLoggedUser);
    router.post('/saveanswer', dbApi.saveAnswer);
    router.get('/logout', userApi.logout);
};


