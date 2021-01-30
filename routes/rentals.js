const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Fawn = require('fawn')
Fawn.init(mongoose)

const { Rental, validate } = require('../models/rental')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')

router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find().sort('-dateOut')
    res.send(rentals)
  } catch(err) {
    res.status(500).send(err.message)
  }
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(400).send('Customer Invalid')

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(400).send('Movie Invalid')

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock')

  const rental = Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    }
  })

  try {
    // const result = await rental.save()

    // movie.numberInStock--
    // movie.save()

    // Simulate DB Transactions with Fawn
    const task = new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run()
  
    res.send(rental)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = router