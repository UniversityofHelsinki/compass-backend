const dbService = require('../services/dbService');
const messageKeys = require('../utils/message-keys');
const { logger } = require('../logger');

exports.getHelloFromDb = async (req, res) => {
    try {
        const response = await dbService.getHelloFromBackend();
        res.json(response);
    } catch (err) {
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

const isUserInCourse = async (course_id, user_id) => {
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

const addUserToCourse = async (user_id, course_id) => {
    try {
        return await dbService.connectusertocourse(user_id, course_id);
    } catch (error) {
        console.error(`Error POST /addUserToCourse ${error} USER ${user_id} COURSE ${course_id}`);
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

let addUser = (exports.addUser = async (user) => {
    try {
        return await dbService.addUser(user);
    } catch (error) {
        const msg = error.message;
        logger.error(`Error POST /adduser ${error}  ${msg} USER ${user.eppn}`);
        throw error;
    }
});

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
    const { course } = req.params;
    const user_id = req.user.eppn;
    try {
        let user_exist = await userInDatabase(user_id);
        if (user_exist?.message === messageKeys.USER_NOT_EXIST) {
            logger.error('User not in database', user_id);
            let user_added = await addUser(req.user);
            if (user_added?.message !== messageKeys.USER_ADDED) {
                logger.error('User NOT added', user_id);
                return;
            } else {
                logger.info('User added', user_id);
            }
        } else {
            logger.info('User already in database', user_id);
        }
        let user_in_course = await isUserInCourse(course, user_id);
        if (user_in_course?.message === messageKeys.USER_NOT_IN_COURSE) {
            logger.error(`User not in course, USER ${user_id} COURSE ${course}`);
            let user_to_course_added = await addUserToCourse(user_id, course);
            if (user_to_course_added?.message !== messageKeys.USER_ADDED_TO_COURSE) {
                logger.error(`User NOT added in the course, USER ${user_id} COURSE ${course}`);
            } else {
                logger.info(`User added in the course, USER ${user_id} COURSE ${course}`);
            }
        }
    } catch (error) {
        logger.error(`error connectusertocourse`);
        const msg = error.message;
        logger.error(
            `Error POST /connectusertocourse ${error} ${msg}  USER ${req.user.eppn} COURSE ${course}`,
        );
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
