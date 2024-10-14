
const { dbClient } = require('./../services/dbService.js');
const userService = require("../services/userService");

exports.teacher = (router) => {

  router.get('/courses', async (req, res) => {
    const user = userService.getLoggedUser(req.user);
    res.json(await dbClient(`/api/teacher/courses/${user.eppn}`));
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
