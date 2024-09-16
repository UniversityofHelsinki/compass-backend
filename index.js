require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const routes = require('./api/routes');
const compression = require('compression');
const security = require('./security');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { logger } = require('./logger');

const ipaddress = process.env.AZURE_NODEJS_IP || '127.0.0.1';

app.use(compression());
app.use(cookieParser());
app.use(
    cors()
);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

security.shibbolethAuthentication(app, passport);

const router = express.Router();
app.use('/api', router);
routes(router);

// Specify the port to listen on
const port = 5000;

// Start the server
app.listen(port, ipaddress, () => {
    logger.info(`Node.js HTTP server is running on port ${port} and ip address ${ipaddress}`);
});
