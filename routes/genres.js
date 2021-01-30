const auth = require('../middleware/auth')
const { Genre, validate } = require('../models/genre')
const express = require('express');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async')
const router = express.Router();

// Genre.insertMany(genres)

// NB: If you want to use the await/async method
// Just add the async to the router callback e.g. async (req, res)
// That way you can work with await as you would
// e.g const genres = await Genre.find().sort('name)
//     res.send(genres)

router.get('/', (req, res) => {
  Genre.find().select('_id name')
    .sort('name')
    .then((genres) => res.send(genres))
    .catch(err => res.status(500).send('An error occured'))
})

router.post('/', auth, (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const genre = new Genre({
    name: req.body.name
  })

  genre.save()
    .then((genre) => res.send(genre))
    .catch(err => res.status(500).send(err.message))
})

router.get('/:id', (req, res) => {
  Genre.findById(req.params.id)
    .then((genre) => {
      if (!genre) return res.status(404).send('The genre with the given ID is not found')
      return res.send(genre)
    })
    .catch((err) => res.status(500).send(err.message))
})

router.put('/:id', (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  Genre.findByIdAndUpdate(req.params.id,
    { name: req.body.name },
    { new: true }
  )
    .then((genre) => {
      if (!genre) return res.status(404).send('The genre with the given ID is not found')
      return res.send(genre)
    })
    .catch((err) => next(err))
  
})

router.delete('/:id', [auth, admin], (req, res) => {
  
  Genre.findByIdAndDelete({ _id: req.params.id })
    .then((genre) => {
      if (!genre) return res.status(404).send('The genre with the given ID is not found')
      return res.send(genre)
    })
    .catch((err) => res.status(500).send(err.message))

})

module.exports = router