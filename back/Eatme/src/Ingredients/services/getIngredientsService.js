var models = require('../../../models')

async function getIngredientsService () {

  const queriedIngredients = await models.Ingredient.findAll({
    order: [
      ['id', 'ASC']
    ]
  })

  var ingredients = []

  queriedIngredients.forEach(queriedIngredient => {
    ingredients.push({ id: queriedIngredient.id, name: queriedIngredient.name })
  })

  return ingredients
}

module.exports = getIngredientsService