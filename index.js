const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
const app = express()

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()

app.set('view engine', 'pug')

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on Port ${port}`)
})