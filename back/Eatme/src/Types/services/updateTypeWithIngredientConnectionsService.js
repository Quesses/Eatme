var models = require('../../../models')

async function updateTypeWithIngredientConnectionsService (typeId, ingredients) {
  const connections = await models.TypeIngredient.findAll({ 
    where : {
    TypeId: typeId
    }, 
    include: {
      model: models.Ingredient,
      as: 'Ingredient'
    }
  })
  await Promise.all(connections.map(async connection => {
    const ingredient = connection.Ingredient
    if (ingredients.indexOf(ingredient.name) === -1) {
      await models.TypeIngredient.destroy({
        where: {
          typeId: typeId,
          ingredientId: ingredient.id
        }
      })
    }
  }))
  return 1
}

module.exports = updateTypeWithIngredientConnectionsService