const config = require('config')
const winston = require('winston')
require('winston-mongodb')
const express = require('express')
const app = express()

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()

if (!config.get('jwtPrivateKey')) {
  winston.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

app.set('view engine', 'pug')

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on Port ${port}`)
})