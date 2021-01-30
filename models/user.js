const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
  return token
}

const User = new mongoose.model('User', userSchema)

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().required()
  })

  return schema.validate(user)
}

exports.User = User
exports.validate = validateUser