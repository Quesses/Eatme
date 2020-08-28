const { createDishService,
        connectDishWithIngredientService } = require('../services')

const { createIngredientsService } = require('../../Ingredients/services')
const { connectTypeWithIngredientService } = require('../../Types/services')

async function createDishController (req, res, next) {
  const requestDto = req.body.dish
  const dishName = requestDto.name
  const typeName = requestDto.type

  let result = await createDishService(dishName, typeName)
  
  if (!result) {
    return res.status(409).send({ dishExist: dishName })
  }

  if (requestDto.extraIngredients.length > 0) {
    await createIngredientsService(requestDto.extraIngredients)
  }

  await Promise.all(requestDto.extraIngredients.map(async ingr => {
    await connectTypeWithIngredientService(typeName, ingr)
  }))

  await Promise.all(requestDto.ingredients.map(async ingr => {
    await connectDishWithIngredientService(dishName, ingr)
  }))

  res.sendStatus(201)
  next()
}

module.exports = createDishController