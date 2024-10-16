const utf8 = require('utf8');
const Constants = require("../Constants");

const logoutUser = (req, res, url) => {
    if (req.cookies) {
        Object.keys(req.cookies).forEach(cookie => {
            if (!cookie.includes(Constants.SHIBBOLETH_COOKIE_NAME)) {
                res.clearCookie(cookie);
            }
        });
    }
    res.redirect(url);
};

const concatenateArray = (data) => [].concat(data);

module.exports = {
    logoutUser : logoutUser
};
