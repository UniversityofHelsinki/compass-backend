const utf8 = require('utf8');
const Constants = require("../Constants");

const getLoggedUser = (user) => {
    const eppn = utf8.decode(user.eppn);
    const eduPersonAffiliation = concatenateArray(utf8.decode(user.eduPersonAffiliation).split(';'));
    const hyGroupCn = concatenateArray(utf8.decode(user.hyGroupCn).split(';'));
    const preferredLanguage = utf8.decode(user.preferredLanguage);
    const displayName = utf8.decode(user.displayName);
    return {
        eppn: eppn,
        eduPersonAffiliation: eduPersonAffiliation,
        hyGroupCn: hyGroupCn,
        preferredLanguage: preferredLanguage,
        displayName: displayName,
        roles : user.roles
    };
};

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

module.exports.logoutUser = logoutUser;

const concatenateArray = (data) => Array.prototype.concat.apply([], data);


module.exports = {
    getLoggedUser : getLoggedUser,
    logoutUser : logoutUser
};
