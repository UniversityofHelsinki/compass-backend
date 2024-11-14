const urlSignerService = require('../services/urlSignerService');
exports.getUrlSignature = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const response = urlSignerService.generateSignedUrl(courseId);
        res.json(response);
    } catch (err) {
        res.status(500);
    }
};
