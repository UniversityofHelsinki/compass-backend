const { dbClient } = require('./../services/dbService.js');

exports.teacher = (router) => {
    router.get('/courses', async (req, res) => {
        const user = req.user;
        res.json(await dbClient(`/api/teacher/courses/${user.eppn}`));
    });

    router.get('/courses/:course', async (req, res) => {
        const { course } = req.params;
        const user = req.user;
        res.json(await dbClient(`/api/teacher/courses/${user.eppn}/${course}`));
    });

    router.post('/courses', async (req, res) => {
        res.json(
            await dbClient(`/api/teacher/courses`, {
                method: 'POST',
                body: JSON.stringify({ ...req.body, user_name: req.user.eppn }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        );
    });

    router.put('/courses', async (req, res) => {
        res.json(
            await dbClient(`/api/teacher/courses`, {
                method: 'PUT',
                body: JSON.stringify({ ...req.body, user_name: req.user.eppn }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        );
    });

    router.get('/courses/:course/questions', async (req, res) => {
        const course = req.params.course;
        res.json(await dbClient(`/api/teacher/courses/${course}/questions`));
    });

    router.get('/courses/:course/assignments', async (req, res) => {
        const course = req.params.course;
        res.json(await dbClient(`/api/teacher/courses/${course}/assignments`));
    });

    router.get('/courses/:course/students', async (req, res) => {
        const course = req.params.course;
        res.json(await dbClient(`/api/teacher/courses/${course}/students`));
    });

    router.get('/statistics/course/:course', async (req, res) => {
        const course = req.params.course;
        res.json(await dbClient(`/api/teacher/statistics/course/${course}`));
    });

    router.get('/assignment/:assignmentId/answers', async (req, res) => {
        const assignmentId = req.params.assignmentId;
        res.json(await dbClient(`/api/teacher/assignment/${assignmentId}/answers`));
    });
};
