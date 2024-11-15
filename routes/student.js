const { dbClient } = require('./../services/dbService.js');
const dbApi = require('../api/dbApi');

exports.student = (router) => {
    router.get('/courses', async (req, res) => {
        const user = req.user;
        res.json(await dbClient(`/api/student/courses/${user.eppn}`));
    });

    router.get('/studentCourses', async (req, res) => {
        const user = req.user;
        res.json(await dbClient(`/api/student/studentCourses/${user.eppn}`));
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

    router.get('/courses/:course/assignments', async (req, res) => {
        const { course } = req.params;
        const user = req.user;
        res.json(await dbClient(`/api/student/courses/${course}/assignments/${user.eppn}`));
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

    router.get('/course/assignment/answer/:course', async (req, res) => {
        const { course } = req.params;
        //const user = req.user;
        dbApi.connectusertocourse(req, res);
        //res.json(await dbClient(`/api/student/course/assignment/answer/${user.eppn}/${course}`));
        res.json(await dbClient(`/api/student/assignments/course/${course}`));
    });

    router.post('/deleteAnswer', dbApi.deleteStudentAnswer);
};
