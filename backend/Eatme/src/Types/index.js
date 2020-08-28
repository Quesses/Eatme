const router = require('express').Router()

const {
  createTypeController,
  getTypesController,
  updateTypeController,
  getTypeByIdController,
  removeTypeByIdController
} = require('./controllers')

router.route('/')
    .post(createTypeController)

router.route('/')
    .get(getTypesController)

router.route('/update')
    .post(updateTypeController)

router.route('/:id')
    .get(getTypeByIdController)

router.route('/:id')
    .delete(removeTypeByIdController)
    

module.exports = router