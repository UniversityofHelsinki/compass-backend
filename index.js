const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require("path");
const cors = require('cors');
const routes = require('./api/routes');
const personsRoute = require('./models/persons');

app.use(
    cors({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, x-transmission-session-id, x-ida-auth-token, content-disposition",
        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS, PUT",
        "Access-Control-Expose-Headers" : "X-Transmission-Session-Id",
        "Secure": false
    })
);

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
app.use(express.static('public'), router); // relative path of client-side code
//app.use('/api', router);
console.log(`__dirname ${__dirname}`);
routes(router, __dirname);
//routes(router);

// Specify the port to listen on
const port = 3010;

// Start the server
app.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});