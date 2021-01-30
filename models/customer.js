const Joi = require('joi')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  phone: { type: String, required: true, minlength: 5, maxlength: 20 }
})

const Customer = new mongoose.model('Customer', customerSchema)

// Client side validation
// Validation of data sent by by client
function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(20).required(),
    isGold: Joi.boolean().default(false)
  })

  return schema.validate(customer)
}

module.exports.Customer = Customer
module.exports.schema = customerSchema
module.exports.validate = validateCustomer