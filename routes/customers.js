const {Customer, validate } = require('../models/customer')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort('name')
    res.send(customers)
  } catch(err) {
    res.status(400).send(err.message)
  }
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  })

  try {
    await customer.save()
    res.send(customer)
  } catch(err) {
    res.status(500).send(err.message)
  }

})

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.send('Customer with the given ID not found')
    res.send(customer)
  } catch(err) {
    res.status(400).send(err.message)
  }
})

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    let customer = await Customer.findById(req.params.id,)
    if (!customer) return res.send('Customer with the given ID not found')

    if(req.body.name) customer.name = req.body.name
    if(req.body.phone) customer.phone = req.body.phone
    if(req.body.isGold) customer.isGold = req.body.isGold

    await customer.save()
    res.send(customer)
  } catch(err) {
    res.status(400).send(err.message)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if (!customer) return res.send('Customer with the given ID not found')
    res.send(customer)
  } catch(err) {
    res.status(400).send(err.message)
  }
})

module.exports = router