const Joi = require('joi')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    minLength: 3,
    maxLength: 50
  }
})

const Genre = new mongoose.model('Genre', genreSchema)

// Client side validation
// Validation of data sent by by client
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  return schema.validate(genre)
}

exports.Genre = Genre
exports.schema = genreSchema
exports.validate = validateGenre