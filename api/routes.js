require('dotenv').config();

const dbApi = require('../api/dbApi');
const userApi = require('../api/userApi');
const urlSigner = require('../api/urlSigner');

module.exports = function (router) {
    router.get('/hello', dbApi.getHelloFromDb);
    router.get('/user', userApi.getLoggedUser);
    router.post('/saveAnswer', dbApi.saveAnswer);
    //router.get('/isuserincourse/:course_id', dbApi.isuserincourse);
    router.get('/userExist', dbApi.userExist);
    router.post('/addcourse', dbApi.addcourse);
    router.get('/logout', userApi.logout);
    router.get('/getUrlSignature/:courseId', urlSigner.getUrlSignature);
};
