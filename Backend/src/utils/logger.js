const { createLogger, format, transports } = require('winston');

// Create a Winston logger instance
const logger = createLogger({
  level: 'info', // Set default log level
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Logs to the console
    new transports.File({ filename: 'logs/app.log' }) // Logs to a file
  ]
});

module.exports = logger;
