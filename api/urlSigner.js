const { generateSignedUrl } = require('../security');
exports.getUrlSignature = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const response = generateSignedUrl(courseId);
        res.json(response);
    } catch (err) {
        res.status(500);
    }
};

exports.signatures = (courses) => {
  return courses.reduce((signatures, course) => ({ [course]: generateSignedUrl(course), ...signatures }), {});
};
