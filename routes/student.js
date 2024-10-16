const { dbClient } = require('./../services/dbService.js');
const userService = require("../services/userService");
const dbApi = require("../api/dbApi");

exports.student = (router) => {

  router.get('/courses', async (req, res) => {
    const user = userService.getLoggedUser(req.user);
    res.json(await dbClient(`/api/student/courses/${user.eppn}`));
  });

  router.get('/courses/:course/assignments', async (req, res) => {
    const { course } = req.params;
    const user = userService.getLoggedUser(req.user);
    res.json(await dbClient(`/api/student/courses/${course}/assignments/${user.eppn}`));
  });

  router.get('/courses/:course/answers', async (req, res) => {
    const { course } = req.params;
    const user = userService.getLoggedUser(req.user);
    res.json(await dbClient(`/api/student/courses/${course}/answers/${user.eppn}`));
  });

  router.get('/courses/:course/assignments', async (req, res) => {
    const { course } = req.params;
    const user = userService.getLoggedUser(req.user);
    res.json(await dbClient(`/api/student/courses/${course}/assignments/${user.eppn}`));
  });

  router.get('/answer/:assignment_id/:student', async (req, res) => {
    const { assignment_id, student } = req.params;
    res.json(await dbClient(`/api/student/answer/${assignment_id}/${student}`));
  });

  router.get('/course/:course_id', async (req, res) => {
    const { course_id } = req.params;
    res.json(await dbClient(`/api/student/course/${course_id}`));
  });

  router.get('/course/assignment/:assignment_id', async (req, res) => {
    const { assignment_id, student } = req.params;
    res.json(await dbClient(`/api/student/course/assignment/${assignment_id}`));
  });

  router.get('/assignment/course/:assignment_id', async (req, res) => {
    const { assignment_id } = req.params;
    res.json(await dbClient(`/api/student/assignment/course/${assignment_id}`));
  });

  router.get('/course/assignment/answer/:assignment_id', async (req, res) => {
    const { assignment_id } = req.params;
    const user = userService.getLoggedUser(req.user);
    res.json(await dbClient(`/api/student/course/assignment/answer/${assignment_id}/${user.eppn}`));
  });

  router.post('/deleteAnswer', dbApi.deleteStudentAnswer);

};
