const { dbClient } = require('./../services/dbService.js');

exports.student = (router) => {

  router.get('/courses', async (req, res) => {
    const user = req.user;
    res.json(await dbClient(`/api/student/courses/${user.eppn}`));
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
};
