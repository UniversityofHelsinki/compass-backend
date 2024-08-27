const dbService = require('../services/dbService');

exports.getHelloFromDb = async (req, res) => {
    try {
        const response = await dbService.getHelloFromBackend();
        res.json(response);
    } catch(err) {
        const msg = err.message;
        res.status(500);
    }
};
