// const Joi = require('joi')
// Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const { schema: genreSchema } = require('./genre')

const Genre = new mongoose.model('Genre', genreSchema)
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 500
  }
})

const Movie = new mongoose.model('Movie', movieSchema)

// Client side validation
// Validation of data sent by by client
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0).required(),
  })

  return schema.validate(movie)
}

exports.Movie = Movie
exports.schema = movieSchema
exports.validate = validateMovie