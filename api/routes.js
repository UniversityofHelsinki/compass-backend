require('dotenv').config();

const dbApi = require('../api/dbApi');
const userApi = require("../api/userApi");

module.exports = function (router) {
    router.get('/hello', dbApi.getHelloFromDb);
    router.get('/user', userApi.getLoggedUser);
    router.post('/saveanswer', dbApi.saveAnswer);
    router.get('/isstudentincourse', dbApi.isstudentincourse);
    router.post('/addstudenttocourse', dbApi.addstudenttocourse);
    router.post('/addstudent', dbApi.addstudent);
    router.get('/studentExist', dbApi.studentExist);
    router.post('/newassignment/:course_id', dbApi.newassignment);
    router.get('/logout', userApi.logout);
};


