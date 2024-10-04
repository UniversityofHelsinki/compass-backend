
const { dbClient } = require('./../services/dbService.js');

exports.teacher = (router) => {

  router.get('/courses/:teacher', async (req, res) => {
    const teacher = req.params.teacher;
    res.json(await dbClient(`/api/teacher/courses/${teacher}`));
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

};
