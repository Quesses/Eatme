const router = require('express').Router()


const {
  createDishController,
  getDishesController,
  updateDishController,
  getDishByIdController,
  removeDishByIdController
} = require('./controllers')

var subscriptions = []

function subscribe (req, res) {
  subscriptions.push(res)
  req.on('close', function () {
    delete subscriptions[subscriptions.indexOf(res)]
  })
}

async function longPoll () {
  subscriptions.forEach(res => {
    res.sendStatus(200)
  })
}

router.route('/subscribe')
    .get(subscribe)

router.route('/')
    .get(getDishesController)

router.route('/:id')
    .get(getDishByIdController)

router.route('/')
    .post(createDishController, longPoll)

router.route('/update')
    .post(updateDishController, longPoll)

router.route('/:id')
    .delete(removeDishByIdController, longPoll)    

module.exports = router