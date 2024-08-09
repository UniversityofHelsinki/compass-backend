const path = require("path");

module.exports = (router, rootDir) => {
    console.log(`eka rootDir ${rootDir}`);
    /*router.route('/').get((req, res) => {
        //res.render(path.resolve('../public/index.html'));
        res.sendFile('index.html', {root : rootDir + '/public'});
    });*/
    router.route('/').get(('*', (req, res) => {
        res.sendFile('index.html', { root: __dirname })
    }))
}
