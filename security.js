let ReverseProxyStrategy = require('passport-reverseproxy');
const ipaddr = require('ipaddr.js');
const userService = require("./services/userService");
const constants = require("/utils/constants");
/**
 * Contains the IP address of the local host.
 *
 * The variable `localhostIP` is instantiated with the processed
 * IP address string '127.0.0.1' using the `ipaddr.process()` method.
 */
const localhostIP = ipaddr.process('127.0.0.1');

/**
 * Configures Shibboleth authentication for the given Express application.
 *
 * @param {Object} app - The Express application instance.
 * @param {Object} passport - The Passport.js instance.
 *
 * This function sets up Passport.js to use the Reverse Proxy Strategy which handles the
 * authentication headers. These headers include 'eppn', 'eduPersonAffiliation', 'preferredLanguage',
 * 'hyGroupCn', and 'displayName'. The 'eppn' header is required, while the others are optional.
 *
 * The authentication middleware is applied to the Express application to ensure that
 * requests are authenticated based on the configured strategy. If authentication fails,
 * a 401 Unauthorized response is sent.
 */
const shibbolethAuthentication = (app, passport) => {
    passport.use(new ReverseProxyStrategy({
        headers: {
            'eppn': { alias: 'eppn', required: true },
            'eduPersonAffiliation': { alias: 'eduPersonAffiliation', required: false },
            'preferredlanguage': { alias: 'preferredLanguage', required: false },
            'hyGroupCn': { alias: 'hyGroupCn', required: false },
            'displayName': { alias: 'displayName', required: false }
        },
        whitelist: localhostIP
    }));

    app.use(passport.initialize());

    app.use((req, res, next) => {
        passport.authenticate('reverseproxy', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).send('Not Authorized');
            }
            req.user = user;
            next();
        })(req, res, next);
    });
};

/**
 * Middleware function to confirm if the logged-in user has a teacher role.
 *
 * This function checks if the current user has the role of a teacher based on their
 * affiliations. If the user is not a teacher, it responds with a 403 status and
 * an appropriate message. If the user is a teacher, it proceeds to the next middleware
 * or route handler.
 *
 * @param {Object} req - The request object, containing user information.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 */
const teacherConfirmation = (req, res, next) => {
   const user = userService.getLoggedUser(req.user);
   const isTeacher = user.eduPersonAffiliation.includes(constants.ROLE_TEACHER);
  if (!isTeacher) {
    res.status(403).json('User is not a teacher.');
  } else {
    next();
  }
};

module.exports = {
  shibbolethAuthentication,
  teacherConfirmation
};
