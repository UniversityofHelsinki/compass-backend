const userService = require("../services/userService");
exports.getLoggedUser = (req, res) => {
    console.log(req.user);
    res.json(userService.getLoggedUser(req.user));
};

exports.logout = (req, res) => {
    console.log("logout called");
    const action = req.query.action;
    const redirectUrl = req.query.return;
    console.log(action);
    console.log(redirectUrl);
    if (action === 'logout') {
        res.json(userService.logoutUser(req, res, redirectUrl));
    }
};
