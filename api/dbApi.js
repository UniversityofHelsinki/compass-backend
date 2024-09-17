const dbService = require('../services/dbService');
const messageKeys = require('../utils/message-keys');

exports.getHelloFromDb = async (req, res) => {
    try {
        const response = await dbService.getHelloFromBackend();
        res.json(response);
    } catch(err) {
        const msg = err.message;
        res.status(500);
    }
};

exports.saveAnswer = async (req, res) => {
    try {
        const response = await dbService.saveAnswer(req, res);
        res.json(response);
    } catch(error) {
        console.error(`Error POST /saveAnswer ${error} USER ${req.user.eppn}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_SAVE_ANSWER
        }]);
    }
};

exports.isstudentincourse = async (req, res) => {
    try {
        const response = await dbService.isstudentincourse(req, res);
        res.json(response);
    } catch (error) {
        logger.error(`error checking student in the course`);
        const msg = error.message;
        logger.error(`Error GET /isstudentincourse ${error} ${msg}  USER ${req.user.eppn}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_STUDENT_CHECKING_IN_COURSE
        }]);
    }
}

exports.addstudenttocourse = async (req, res) => {
    try {
        const response = await dbService.addstudenttocourse(req, res);
        res.json(response);
    } catch(error) {
        console.error(`Error POST /addstudenttocourse ${error} USER ${req.user.eppn}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_STUDENT_TO_COURSE
        }]);
    }
}

exports.addstudent = async (req, res) => {
    try {
        const response = await dbService.addstudent(req, res);
        res.json(response);
    } catch(error) {
        console.error(`Error POST /addstudent ${error} USER ${req.user.eppn}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_STUDENT
        }]);
    }
}

exports.studentExist = async (req,res) => {
    try {
        const response = await dbService.studentExist(req, res);
        res.json(response);
    } catch (error) {
        logger.error(`error checking student in the database`);
        const msg = error.message;
        logger.error(`Error GET /studentExist ${error} ${msg}  USER ${req.user.eppn}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_STUDENT_EXIST_IN_DATABASE
        }]);
    }
}
