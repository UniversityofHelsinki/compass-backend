require('dotenv').config();

const dbApi = require('../api/dbApi');
const userApi = require("../api/userApi");

module.exports = function (router) {
    router.get('/hello', dbApi.getHelloFromDb);
    router.get('/user', userApi.getLoggedUser);
    router.post('/saveanswer', dbApi.saveAnswer);
    router.get('/isuserincourse/:course_id', dbApi.isuserincourse);
    router.post('/adduser', dbApi.adduser);
    router.get('/userExist', dbApi.userExist);
    router.post('/addcourse', dbApi.addcourse);
    router.post('/connectusertocourse', dbApi.connectusertocourse);
    router.get('/logout', userApi.logout);
    router.get('/getUserAnswersForCourseId/:course_id', dbApi.getUserAnswersForCourseId);
    router.get('/getUser', dbApi.getUser);
};


