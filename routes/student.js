const { dbClient } = require('./../services/dbService.js');

exports.student = (router) => {

  router.get('/courses/:student', async (req, res) => {
    const student = req.params.student;
    res.json(await dbClient(`/api/student/courses/${student}`));
  });

  router.get('/courses/:course/assignments/:student', async (req, res) => {
    const { course, student } = req.params;
    res.json(await dbClient(`/api/student/courses/${course}/assignments/${student}`));
  });

  router.get('/courses/:course/answers/:student', async (req, res) => {
    const { course, student } = req.params;
    res.json(await dbClient(`/api/student/courses/${course}/answers/${student}`));
  });

  router.get('/courses/:course/assignments/:student', async (req, res) => {
    const { course, student } = req.params;
    res.json(await dbClient(`/api/student/courses/${course}/assignments/${student}`));
  });

};
