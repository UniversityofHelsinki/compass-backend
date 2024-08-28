let ReverseProxyStrategy = require('passport-reverseproxy');
const ipaddr = require('ipaddr.js');
const localhostIP = ipaddr.process('127.0.0.1');

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
        console.log('Middleware hit');
        passport.authenticate('reverseproxy', { session: false }, (err, user, info) => {
            if (err || !user) {
                console.error('Authentication error or no user found', { err, info });
                return res.status(403).send('Forbidden');
            }
            req.user = user;
            console.log("logged user : " , JSON.stringify(user));
            next();
        })(req, res, next);
    });
};

module.exports = {
    shibbolethAuthentication
};
