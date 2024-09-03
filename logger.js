const winston = require('winston');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = { logger };
