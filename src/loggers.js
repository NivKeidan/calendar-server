const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level.toUpperCase()} ${message}`;
  });

  const general_transport = new transports.DailyRotateFile({
    filename: 'combined-%DATE%',
    dirname: './logs',
    datePattern: 'YYYY-MM-DD',
    maxSize: '5m',
    maxFiles: '15',
    extension: '.log'
  });

  const error_transport = new transports.DailyRotateFile({
    filename: 'error-%DATE%',
    dirname: './logs',
    datePattern: 'YYYY-MM-DD',
    maxSize: '5m',
    level: 'warning',
    maxFiles: '15',
    extension: '.log'
  });
  
  module.exports = {
    logger: createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
      ),
    defaultMeta: { service: 'user-service' },
    transports: [ general_transport, error_transport ],
  })
};