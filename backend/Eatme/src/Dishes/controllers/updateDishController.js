const { updateDishWithIngredientConnectionsService,
        connectDishWithIngredientService } = require('../services')

const { createIngredientsService } = require('../../Ingredients/services')
const { connectTypeWithIngredientService } = require('../../Types/services')

async function updateDishController (req, res, next) {
  const requestDto = req.body.dish

  if (requestDto.extraIngredients.length > 0) {
    await createIngredientsService(requestDto.extraIngredients)
  }

  await Promise.all(requestDto.extraIngredients.map(async ingr => {
    await connectTypeWithIngredientService(requestDto.typeName, ingr)
  }))

  await Promise.all(requestDto.ingredients.map(async ingr => {
    await connectDishWithIngredientService(requestDto.dishName, ingr)
  }))
  
  await updateDishWithIngredientConnectionsService(requestDto.id, requestDto.ingredients)

  res.sendStatus(200)
  next()
}

module.exports = updateDishController