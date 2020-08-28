const { updateTypeWithSizeConnectionsService,
        updateTypeWithIngredientConnectionsService,
        updateTypeLinkValueService,
        connectTypeWithIngredientService,
        connectTypeWithSizeService } = require('../services')

const { createIngredientsService } = require('../../Ingredients/services')

async function updateTypeController (req, res) {
  const requestDto = req.body.type

  if (requestDto.extraIngredients.length > 0) result = await createIngredientsService(requestDto.extraIngredients)
  
  updateTypeLinkValueService(requestDto.id, requestDto.linkValue)
  
  await Promise.all(requestDto.ingredients.map(async ingr => {
    await connectTypeWithIngredientService(requestDto.name, ingr)
  }))
  await Promise.all(requestDto.sizes.map(async size => {
    await connectTypeWithSizeService(requestDto.name, size)
  }))

  await updateTypeWithIngredientConnectionsService(requestDto.id, requestDto.ingredients)
  await updateTypeWithSizeConnectionsService(requestDto.id, requestDto.sizes)

  res.sendStatus(200)
}

module.exports = updateTypeController