const config = require('config')
const winston = require('winston')
require('winston-mongodb')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const express = require('express')
require('express-async-errors')
const app = express()

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

const homeRouter = require('./routes/home')
const genreRouter = require('./routes/genres')
const customerRouter = require('./routes/customers')
const moviesRouter = require('./routes/movies')
const rentalsRouter = require('./routes/rentals')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const error = require('./middleware/error')

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to the vidly database...'))
  .catch(err => console.log('Error connecting to the vidly database...'))

app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', homeRouter)
app.use('/api/genres', genreRouter)
app.use('/api/customers', customerRouter)
app.use('/api/movies', moviesRouter)
app.use('/api/rentals', rentalsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.use(error)


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on Port ${port}`)
})