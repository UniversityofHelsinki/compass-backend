const winston = require('winston');
const AzureBlobTransport = require('./AzureBlobTransport');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const transports = [];

if (isProduction) {
    transports.push(
        new AzureBlobTransport({ level: 'error' }),
        new AzureBlobTransport({ level: 'info' })
    );
} else {
    transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`)
    ),
    transports: transports
});

// Adding a separate error logger if needed
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`)
    ),
    transports: isProduction ? [new AzureBlobTransport({ level: 'error' })] : [new winston.transports.Console()],
});

module.exports = { logger, errorLogger };
