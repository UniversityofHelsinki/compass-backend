const dbService = require('../services/dbService');
const messageKeys = require('../utils/message-keys');
const { logger } = require('../logger');

exports.getHelloFromDb = async (req, res) => {
    try {
        const response = await dbService.getHelloFromBackend();
        res.json(response);
    } catch (err) {
        const msg = err.message;
        res.status(500);
    }
};

exports.saveAnswer = async (req, res) => {
    try {
        const response = await dbService.saveAnswer(req, res);
        res.json(response);
    } catch (error) {
        console.error(`Error POST /saveAnswer ${error} USER ${req.user.eppn}`);
        res.status(500);
        return res.json([
            {
                message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_ANSWER,
            },
        ]);
    }
};

exports.isuserincourse = async (req, res) => {
    let course_id = req.params.course_id;
    let user_id = req.user.eppn;
    return isUserInCourse(req, res, course_id, user_id);
};
const isUserInCourse = async (req, res, course_id, user_id) => {
    try {
        return await dbService.isuserincourse(course_id, user_id);
    } catch (error) {
        logger.error(`error checking user in the course`);
        const msg = error.message;
        logger.error(`Error GET /isuserincourse ${error} ${msg}  USER ${user_id}`);
        res.status(500);
        res.json([
            {
                message: messageKeys.ERROR_MESSAGE_USER_CHECKING_IN_COURSE,
            },
        ]);
    }
};

exports.addusertocourse = async (req, res) => {
    return addUserToCourse(req, res);
};
const addUserToCourse = async (req, res) => {
    try {
        return await dbService.connectusertocourse(req, res);
    } catch (error) {
        console.error(`Error POST /addUserToCourse ${error} USER ${req.user.eppn}`);
        res.status(500);
        res.json([
            {
                message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_USER_TO_COURSE,
            },
        ]);
    }
};
exports.addcourse = async (req, res) => {
    return addCourse(req, res);
};
const addCourse = async (req, res) => {
    try {
        return await dbService.addcourse(req, res);
    } catch (error) {
        console.error(`Error POST /addcourse ${error} USER ${req.user.eppn}`);
        res.status(500);
        return res.json([
            {
                message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_COURSE,
            },
        ]);
    }
};

exports.addUser = async (req, res) => {
    try {
        const user = req.user;
        return await dbService.addUser(user);
    } catch (error) {
        const msg = error.message;
        logger.error(`Error POST /adduser ${error}  ${msg} USER ${req.user.eppn}`);
        throw error;
    }
};

exports.userExist = async (req, res) => {
    let user_id = req.user.eppn;
    return userInDatabase(user_id);
};
const userInDatabase = async (user_id) => {
    try {
        return await dbService.userExist(user_id);
    } catch (error) {
        logger.error(`error checking user in the database`);
        const msg = error.message;
        logger.error(`Error GET /userInDatabase ${error} ${msg}  USER ${user_id}`);
        throw error;
    }
};

exports.connectusertocourse = async (req, res) => {
    try {
        let user_id = req.user.eppn;
        let user_exist = await userInDatabase(user_id);
        if (user_exist?.message === messageKeys.USER_NOT_EXIST) {
            let user_added = await addUser(req, res);
            if (user_added?.message !== messageKeys.USER_ADDED) {
                return;
            }
        }
        let data = req.body;
        let course_id = data.course_id;
        let user_in_course = await isUserInCourse(course_id, user_id);
        if (user_in_course?.message === messageKeys.USER_NOT_IN_COURSE) {
            let user_to_course_added = await addUserToCourse(req, res);
            if (user_to_course_added?.message !== messageKeys.USER_ADDED_TO_COURSE) {
                return;
            }
        }
        res.json([{ message: messageKeys.ASSIGNMENT_DONE }]);
    } catch (error) {
        logger.error(`error connectusertocourse`);
        const msg = error.message;
        logger.error(`Error POST /connectusertocourse ${error} ${msg}  USER ${req.user.eppn}`);
        res.status(500);
        return res.json([
            {
                message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_USER_TO_COURSE,
            },
        ]);
    }
};

exports.deleteStudentAnswer = async (req, res) => {
    try {
        const response = await dbService.deleteStudentAnswer(req, res);
        return res.status(200).json(response);
    } catch (error) {
        console.error(`Error POST /deleteStudentAnswer ${error} USER ${req.user.eppn}`);
        res.status(500);
        return res.json([
            {
                message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_ANSWER,
            },
        ]);
    }
};
