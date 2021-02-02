const config = require('config')
const winston = require('winston')
require('winston-mongodb')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
require('express-async-errors')

const app = express()
require('./startup/routes')(app)
require('./startup/db')()

// Handling Uncaught exceptions and Unhandled promise rejections with winston
// Can also be logged into db
winston.exceptions.handle(new winston.transports.File({ filename: 'uncaught.log'}))
process.on('unhandledRejection', (ex) => {
  throw ex
})

winston.add(new winston.transports.File({ filename: 'logfile' }))
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }))

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

app.set('view engine', 'pug')

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on Port ${port}`)
})