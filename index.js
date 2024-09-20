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
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const ipaddress = process.env.AZURE_NODEJS_IP || '127.0.0.1';

app.use(compression());
app.use(cookieParser());

// Load the environment file based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
const envFilePath = env === 'development' && fs.existsSync(path.resolve(__dirname, '.env.development.local'))
    ? '.env.development.local'
    : `.env.${env}`;

dotenv.config({ path: path.resolve(__dirname, envFilePath) });
// Get the allowed origin from the environment variable
const allowedOrigin = process.env.ALLOWED_ORIGIN;

const corsOptions = {
    origin: (origin, callback) => {
        // Ensure origin is allowed or request is same-origin
        if (origin === allowedOrigin || !origin) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Deny the request
        }
    },
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS middleware to the app
app.use(cors(corsOptions));
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
