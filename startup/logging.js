const winston = require('winston')
require('winston-mongodb')
require('express-async-errors') 

module.exports = function () {
  // Handling Uncaught exceptions and Unhandled promise rejections with winston
  // Can also be logged into db
  winston.exceptions.handle(new winston.transports.File({ filename: 'uncaught.log'}))
  process.on('unhandledRejection', (ex) => {
    throw ex
  })

  winston.add(new winston.transports.File({ filename: 'logfile' }))
  winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }))
    
}