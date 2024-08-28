const userService = require("../services/userService");
exports.getLoggedUser = (req, res) => {
    res.json(userService.getLoggedUser(req.user));
};

exports.logout = (req, res) => {
    const action = req.query.action;
    const redirectUrl = req.query.return;
    if (action === 'logout') {
        res.json(userService.logoutUser(req, res, redirectUrl));
    }
};
