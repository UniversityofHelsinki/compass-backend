
const { dbClient } = require('./../services/dbService.js');
const userService = require("../services/userService");

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
    res.json(await dbClient(`/api/teacher/courses`, {
      method: 'POST',
      body: JSON.stringify({ ...req.body, user_name: req.user.eppn }),
      headers: {
        'Content-Type': 'application/json'
      }
    }));
  });

  router.put('/courses', async (req, res) => {
    res.json(await dbClient(`/api/teacher/courses`, {
      method: 'PUT',
      body: JSON.stringify({ ...req.body, user_name: req.user.eppn }),
      headers: {
        'Content-Type': 'application/json'
      }
    }));
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
