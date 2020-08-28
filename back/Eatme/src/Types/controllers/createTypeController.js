const { createTypeService, 
        connectTypeWithIngredientService,
        connectTypeWithSizeService } = require('../services')

const { createIngredientsService } = require('../../Ingredients/services')

async function createTypeController (req, res) {
  const requestDto = req.body.type
  const typeName = requestDto.name
  let result = await createTypeService(typeName)
  if (!result) {
    return res.status(409).send({ typeExist: typeName })
  }

  if (requestDto.extraIngredients.length > 0) {
    await createIngredientsService(requestDto.extraIngredients)
  }
  
  await Promise.all(requestDto.ingredients.map(async ingr => {
    await connectTypeWithIngredientService(typeName, ingr)
  }))
  await Promise.all(requestDto.sizes.map(async size => {
    await connectTypeWithSizeService(typeName, size)
  }))
  res.sendStatus(201)
}

module.exports = createTypeController