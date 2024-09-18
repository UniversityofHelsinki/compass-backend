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

const isstudentincourse = async (req, res) => {
    try {
        const response = await dbService.isstudentincourse(req, res);
        return res.json(response);
        /*db projekti palauttaa messageKeys.STUDENT_IS_IN_COURSE tai messageKeys.STUDENT_NOT_IN_COURSE
        Toimi SC-48 tiketin mukaan tässä eli tee kaikki operaatiot kutsuen tästä
        lisää kurssille, lisää opiskelija kantaan jne. req.body pitää sisällään opiskelijan kasitunnuksen ja kurssin id:n
        tai sit tiedot ovat url:ssa, josta ne saa luettua esim. useSearchParams hookilla.*/
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

const addstudent = async (req, res) => {
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

const studentExist = async (req,res) => {
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

exports.newassignment = async (req, res) => {

    try {
        let student_exist = studentExist(req, res);
        if (!student_exist) {
            //res.json([{message: messageKeys.STUDENT_NOT_EXIST}]);
            let studend_added = addstudent(req, res);
        }

        let student_in_course = isstudentincourse(req, res);
        if (!student_in_course) {
            //res.json([{message: messageKeys.STUDENT_NOT_IN_COURSE}]);
            let response = addstudenttocourse(req, resp);
            //res.json([{message: messageKeys.STUDENT_ADDED_TO_COURSE}]);
        }
    } catch (error) {
        logger.error(`error adding new assignment`);
        const msg = error.message;
        logger.error(`Error POST /newassignment ${error} ${msg}  USER ${req.user.eppn}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_STUDENT_CHECKING_IN_COURSE
        }]);
    }

}
