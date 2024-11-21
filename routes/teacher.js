const { dbClient } = require('./../services/dbService.js');
const userService = require('../services/userService');
const {
    validateNewCourse,
    validateExistingCourse,
    validateDeletableCourse,
} = require('../validation/course.js');

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
        const course = { ...req.body, user_name: req.user.eppn };

        const validation = await validateNewCourse(course);

        if (validation.isValid) {
            res.json(
                await dbClient(`/api/teacher/courses`, {
                    method: 'POST',
                    body: JSON.stringify(course),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );
        } else {
            res.status(400).json({
                reason: validation.reason,
            });
        }
    });

    router.put('/courses', async (req, res) => {
        const course = { ...req.body, user_name: req.user.eppn };

        const existingCourse = await dbClient(`/api/teacher/courses/${req.user.eppn}/${course.id}`);
        const validation = await validateExistingCourse(course, existingCourse);
        if (validation.isValid) {
            res.json(
                await dbClient(`/api/teacher/courses`, {
                    method: 'PUT',
                    body: JSON.stringify({ ...req.body, user_name: req.user.eppn }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );
        } else {
            res.status(400).json({
                reason: validation.reason,
            });
        }
    });

    router.delete('/courses', async (req, res) => {
        if (!req.body.id) {
            res.status(400).end();
            return;
        }
        const course = { ...req.body, user_name: req.user.eppn };
        const existingCourse = await dbClient(`/api/teacher/courses/${req.user.eppn}/${course.id}`);
        const validation = await validateDeletableCourse(existingCourse, req.user);
        if (validation.isValid) {
            await dbClient(`/api/teacher/courses`, {
                method: 'DELETE',
                body: JSON.stringify({ ...req.body, user_name: req.user.eppn }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            res.status(200).end();
        } else {
            res.status(400).json({
                reason: validation.reason,
            });
        }
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
