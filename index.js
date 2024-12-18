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
const cors = require('cors');
const { logger } = require('./logger');
const { teacher } = require('./routes/teacher.js');
const { student } = require('./routes/student.js');

const ipaddress = process.env.AZURE_NODEJS_IP || 'localhost';

app.use(compression());
app.use(cookieParser());

const allowedOrigin = process.env.ALLOWED_ORIGIN;

const corsOptions = {
    origin: (origin, callback) => {
        // Ensure origin is allowed or the request is same-origin
        if (origin === allowedOrigin || !origin) {
            callback(null, true); // Allow the request
        } else {
            logger.warn(`CORS denied: ${origin}`);
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
const studentRouter = express.Router();
const teacherRouter = express.Router();

app.use('/api', router);
routes(router);

router.use('/student', studentRouter);
student(studentRouter);

router.use('/teacher', security.teacherConfirmation);
router.use('/teacher', teacherRouter);
teacher(teacherRouter);

// Specify the port to listen on
const port = 5000;

// Start the server
app.listen(port, ipaddress, () => {
    logger.info(`Node.js HTTP server is running on port ${port} and ip address ${ipaddress}`);
});
