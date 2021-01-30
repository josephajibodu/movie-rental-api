const { Movie, validate } = require('../models/movie')
const { Genre } = require('../models/genre')
const express = require('express')
const router = express.Router()

// For handling all server errors
// No need for try catch block in the routes
const asyncMiddleware = require('../middleware/async')


router.get('/', async (req, res) => {
  throw new Error('Could not locate the movies Database')
  const movies = await Movie.find()
    .select('title genre numberInStock dailyRentalRate')
    res.send(movies)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findById(req.body.genreId)
  if (!genre) return res.status(400).send('Invalid Genre')

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock || 0,
    dailyRentalRate: req.body.dailyRentalRate,
  })

  try {
    await movie.save()
    res.send(movie)
  } catch(err) {
    res.status(500).send(err.message)
  }

})

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.send('Movie with the given ID not found')
    res.send(movie)
  } catch(err) {
    res.status(400).send(err.message)
  }
})

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    let movie = await Movie.findById(req.params.id,)
    if (!movie) return res.send('Movie with the given ID not found')

    if(req.body.title) movie.title = req.body.title
    if(req.body.numberInStock) movie.numberInStock = req.body.numberInStock
    if(req.body.dailyRentalRate) movie.dailyRentalRate = req.body.dailyRentalRate
    if(req.body.genreId) {
      const genre = await Genre.findById(req.body.genreId)
      if (!genre) return res.status(400).send('Invalid Genre')
      movie.genre = {
        _id: genre._id,
        name: genre.name
      }
    }

    await movie.save()
    res.send(movie)
  } catch(err) {
    res.status(400).send(err.message)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id, { useFindAndModify: false })
    if (!movie) return res.send('Movie with the given ID not found')
    res.send(movie)
  } catch(err) {
    res.status(400).send(err.message)
  }
})

module.exports = router