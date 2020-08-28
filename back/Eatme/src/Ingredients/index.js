const router = require('express').Router()

const {
  getIngredientsController,
  getIngredientByIdController,
  removeIngredientByIdController
} = require('./controllers')

router.route('/')
    .get(getIngredientsController)

router.route('/:id')
    .get(getIngredientByIdController)
    
router.route('/:id')
    .delete(removeIngredientByIdController)

module.exports = router