const { persons  } = require("../models/persons");
const path = require("path");

/*module.exports = (router) => {
    router.get('/persons', persons);
};*/
module.exports = (router, rootDir) => {
    console.log(`eka rootDir ${rootDir}`);
    /*router.route('/')
        .get((req, res) => {
            console.log(`toka rootDir ${rootDir}`);
            res.render(path.resolve(rootDir, "./public/index.html"), {nonce: res.locals.cspNonce});
        });*/
    /*router.route('/').get((req, res) => {
        //res.render(path.resolve('../public/index.html'));
        res.sendFile('index.html', {root : rootDir + '/public'});
    });*/
    router.route('/').get(('*', (req, res) => {
        res.sendFile('index.html', { root: __dirname })
    }))
}
