const winston = require('winston')
const express = require('express')
const app = express()

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validator')()

app.set('view engine', 'pug')

const port = process.env.PORT || 3000
app.listen(port, () => {
  winston.info(`Listening on Port ${port}`)
})