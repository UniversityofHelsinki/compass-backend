const { dbClient } = require('./../services/dbService.js');
const dbApi = require('../api/dbApi');
const { generateSignedUrl } = require('../security');
const { logger } = require('../logger');
const messageKeys = require('../utils/message-keys');

exports.student = (router) => {
    router.get('/courses', async (req, res) => {
        const user = req.user;
        res.json(await dbClient(`/api/student/courses/${user.eppn}`));
    });

    router.get('/studentCourses', async (req, res) => {
        const user = req.user;
        res.json(await dbClient(`/api/student/studentCourses/${user.eppn}`));
    });

    router.get('/studentsInCourse/:course_id', async (req, res) => {
        const course_id = req.params.course_id;
        res.json(await dbClient(`/api/student/studentsInCourse/${course_id}`));
    });

    router.get('/courses/:course/assignments', async (req, res) => {
        const { course } = req.params;
        const user = req.user;
        res.json(await dbClient(`/api/student/courses/${course}/assignments/${user.eppn}`));
    });

    router.get('/courses/:course/answers', async (req, res) => {
        const { course } = req.params;
        const user = req.user;
        res.json(await dbClient(`/api/student/courses/${course}/answers/${user.eppn}`));
    });

    router.get('/feedbackForCourse/:course_id', async (req, res) => {
        const { course_id } = req.params;
        res.json(await dbClient(`/api/student/feedbackForCourse/${course_id}`));
    });

    router.get('/feedback/:course_id/:assignment_id', async (req, res) => {
        const { course_id, assignment_id } = req.params;
        const user = req.user;
        res.json(
            await dbClient(`/api/student/feedback/${course_id}/${assignment_id}/${user.eppn}`),
        );
    });

    router.get('/answer/:assignment_id/:student', async (req, res) => {
        const { assignment_id, student } = req.params;
        res.json(await dbClient(`/api/student/answer/${assignment_id}/${student}`));
    });

    router.get('/course/:id', async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        res.json(await dbClient(`/api/student/course/${id}/${user.eppn}`));
    });

    router.get('/course/assignment/feedback/:assignment_id', async (req, res) => {
        const { assignment_id } = req.params;
        res.json(await dbClient(`/api/student/course/assignment/feedback/${assignment_id}`));
    });

    router.get('/assignment/course/:assignment_id', async (req, res) => {
        const { assignment_id } = req.params;
        res.json(await dbClient(`/api/student/assignment/course/${assignment_id}`));
    });

    router.get('/course/assignment/answer/:assignment_id/:course', async (req, res) => {
        const { assignment_id, course } = req.params;
        const user = req.user;
        res.json(
            await dbClient(
                `/api/student/course/assignment/answer/${assignment_id}/${user.eppn}/${course}`,
            ),
        );
    });

    router.get('/course/assignment/answer/:course', async (req, res, next) => {
        const { course } = req.params;
        const user = req.user;
        const { id, signature } = req.query;
        const originalSignature = generateSignedUrl(id);
        if (signature !== originalSignature) {
            logger.error(`signature not valid for course ${course}, user ${req.user.eppn}`);
            return res.status(401).json({});
        }
        await dbApi.connectusertocourse(req, res);
        if (!res.headersSent) {
            res.json(await dbClient(`/api/student/assignments/course/${user.eppn}/${course}`));
        }
    });

    router.post('/deleteAnswer', dbApi.deleteStudentAnswer);

    router.put('/updateResearchAuthorization', async (req, res) => {
        res.json(
            await dbClient(`/api/student/updateResearchAuthorization`, {
                method: 'PUT',
                body: JSON.stringify({ ...req.body }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        );
    });

    router.get('/userCourse/:course_id', async (req, res) => {
        const user = req.user;
        const { course_id } = req.params;
        console.log('userCourse', course_id, user.eppn);
        const result = await dbClient(`/api/student/userCourse/${user.eppn}/${course_id}`);
        res.json(result);
    });
};
