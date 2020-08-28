var models = require('../../../models')

async function connectDishWithIngredientService (dish, ingr) {
  const Dish = await models.SingleDishWithType.findOne({ where: { name: dish } })

  const Ingredient = await models.Ingredient.findOne({ where: { name: ingr } })
  const result = await models.DishIngredient.findOrCreate({ where : {
    SingleDishWithTypeId: Dish.id,
    IngredientId: Ingredient.id
  }})
  return result[1]
}

module.exports = connectDishWithIngredientService