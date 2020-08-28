var models = require('../../../models')

async function updateDishWithIngredientConnectionsService (dishId, ingredients) {
  const connections = await models.DishIngredient.findAll({ 
    where : {
    SingleDishWithTypeId: dishId
    }, 
    include: {
      model: models.Ingredient,
      as: 'Ingredient'
    }
  })
  await Promise.all(connections.map(async connection => {
    const ingredient = connection.Ingredient
    if (ingredients.indexOf(ingredient.name) === -1) {
      await models.DishIngredient.destroy({
        where: {
          SingleDishWithTypeId: dishId,
          ingredientId: ingredient.id
        }
      })
    }
  }))
  return 1
}

module.exports = updateDishWithIngredientConnectionsService