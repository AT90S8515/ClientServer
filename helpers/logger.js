const winston = require('winston');

// Create a custom logger extending Winston
const logger = winston.createLogger({
  level: process.env.WINSTON_LEVEL,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: process.env.WINSTON_FILENAME})
  ]
});

// If we are not running in production, log everything to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Function to make morgan write output to our logger
const stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
module.exports.stream = stream;
