const userService = require('../services/userService');
const { logger } = require('../logger');
const { addUser } = require('./dbApi');
exports.getLoggedUser = async (req, res) => {
    logger.info('found user : ', req.user);
    await addUser(req.user);
    res.json(req.user);
};

exports.logout = (req, res) => {
    const action = req.query.action;
    const redirectUrl = req.query.return;
    if (action === 'logout') {
        res.json(userService.logoutUser(req, res, redirectUrl));
    }
};
