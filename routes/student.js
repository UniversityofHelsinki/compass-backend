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
    res.json(await dbClient(`/api/student/course/assignment/answer/${assignment_id}`));
  });

};
