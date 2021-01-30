const Joi = require('joi')
const mongoose = require('mongoose')
const { schema: movieSchema } = require('./movie')

const Rental = new mongoose.model('Rental', new mongoose.Schema({
  customer: {
    // A different schema is created to avoid including all details(e.g. 50 details) that could
    // be in a customer document
    type: new mongoose.Schema({
      isGold: { type: Boolean, default: false },
      name: { type: String, required: true, minlength: 5, maxlength: 50 },
      phone: { type: String, required: true, minlength: 5, maxlength: 20 }
    }),
    required: true
  },
  // Same reason as above
  // The necessary data for the movie document are the ones included (SNAPSHOT)
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 500
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0
  }
}))

// Client side validation
// Validation of data sent by by client
function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  })

  return schema.validate(rental)
}

exports.Rental = Rental
exports.validate = validateRental