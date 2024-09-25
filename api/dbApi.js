const dbService = require('../services/dbService');
const messageKeys = require('../utils/message-keys');
const { logger } = require('../logger');

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
        let course_id = req.params.course_id;
        let user_id = req.params.student_id;
        return isStudentInCourse(req, res, course_id, user_id);
}
const isStudentInCourse = async (course_id, student_id) => {
    try {
        return await dbService.isstudentincourse(course_id, student_id);
        /*db projekti palauttaa messageKeys.STUDENT_IS_IN_COURSE tai messageKeys.STUDENT_NOT_IN_COURSE
        Toimi SC-48 tiketin mukaan tässä eli tee kaikki operaatiot kutsuen tästä
        lisää kurssille, lisää opiskelija kantaan jne. req.body pitää sisällään opiskelijan kasitunnuksen ja kurssin id:n
        tai sit tiedot ovat url:ssa, josta ne saa luettua esim. useSearchParams hookilla.*/
    } catch (error) {
        logger.error(`error checking student in the course`);
        const msg = error.message;
        logger.error(`Error GET /isstudentincourse ${error} ${msg}  STUDENT ${student_id}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_STUDENT_CHECKING_IN_COURSE
        }]);
    }
}

exports.addstudenttocourse = async (req, res) => {
    let course_id = req.params.course_id;
    let student_id = req.user.eppn;
        return addStudentToCourse(course_id, student_id);
}
const addStudentToCourse = async (course_id, student_id) => {
    try {
        return await dbService.addstudenttocourse(course_id, student_id);
    } catch(error) {
        console.error(`Error POST /addstudenttocourse ${error} USER ${student_id}`);
        res.status(500);
        return res.json([{
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_STUDENT_TO_COURSE
        }]);
    }
}

exports.addstudent = async (req, res) => {
        return addStudent(req, res);
}
const addStudent = async (req, res) => {
    try {
        return await dbService.addstudent(req, res);
    } catch(error) {
        const msg = error.message;
        logger.error(`Error POST /addstudent ${error}  ${msg} USER ${req.user.eppn}`);
        throw error;
    }
}

exports.studentExist = async (req, res) => {
    let student_id = req.user.eppn;
    return studentInDatabase(student_id);
}
const studentInDatabase = async (student_id) => {
    try {
        return await dbService.studentExist(student_id);
    } catch (error) {
        logger.error(`error checking student in the database`);
        const msg = error.message;
        logger.error(`Error GET /studentExist ${error} ${msg}  USER ${student_id}`);
        throw error;
    }
}

exports.connectstudenttocourse = async (req, res) => {
    try {
        let course_id = req.params.course_id;
        let student_id = req.user.eppn;
        let student_exist = await studentInDatabase(student_id);
        if (student_exist.length === 1 && student_exist[0]?.message === messageKeys.STUDENT_NOT_EXIST) {
            //res.json([{message: messageKeys.STUDENT_NOT_EXIST}]);
            let studend_added = await addStudent(req, res);
            if (studend_added.length === 1 && studend_added[0]?.message !== messageKeys.STUDENT_ADDED) {
                throw new Error(`Error POST /newassignment student not found, but failed to add in the database, USER ${req.user.eppn}`)
            }
        }

        let student_in_course = await isStudentInCourse(course_id, student_id);
        if (student_in_course.length === 1 && student_in_course[0]?.message === messageKeys.STUDENT_NOT_IN_COURSE) {
            //res.json([{message: messageKeys.STUDENT_NOT_IN_COURSE}]);
            let studend_to_course_added = await addStudentToCourse(course_id, student_id);
            //res.json([{message: messageKeys.STUDENT_ADDED_TO_COURSE}]);
            if (studend_to_course_added.length === 1 && studend_to_course_added[0]?.message !== messageKeys.STUDENT_ADDED_TO_COURSE) {
                throw new Error(`Error POST /newassignment student not found in course, but failed to add in the database, USER ${req.user.eppn}`)
            }
        }
        res.json([{message: messageKeys.ASSIGNMENT_DONE}]);
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
