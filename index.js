require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require("path");
const cors = require('cors');
const routes = require('./api/routes');

const ipaddress = process.env.AZURE_NODEJS_IP || '127.0.0.1';

app.use(
    cors({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, x-transmission-session-id, x-ida-auth-token, content-disposition",
        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS, PUT",
        "Access-Control-Expose-Headers" : "X-Transmission-Session-Id",
        "Secure": false
    })
);

let scriptSources = ["'self'", "https://cdn.jsdelivr.net", "https://www.helsinki.fi", "https://commission.europa.eu", "https://beyondbadapples.eu", "https://cdnjs.cloudflare.com"];

app.use(helmet({
    //contentSecurityPolicy: false,
    useDefaults: false,
    contentSecurityPolicy: {
    directives: {
        "script-src": scriptSources,
            //"style-src": null,
    },
},
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
app.use(express.static('public'), router);
//app.use('/api', router);
console.log(`__dirname ${__dirname}`);
routes(router, __dirname);
//routes(router);

// Specify the port to listen on
const port = 5000;

// Start the server
app.listen(port, ipaddress, () => {
    console.log(`Node.js HTTP server is running on port ${port} and ip address ${ipaddress}`);
});
