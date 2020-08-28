var models = require('../../../models')

async function connectTypeWithIngredientService (type, ingr) {
  const Type = await models.Type.findOne({ where: { name: type } })
  const Ingredient = await models.Ingredient.findOne({ where: { name: ingr } })
  const result = await models.TypeIngredient.findOrCreate({ where : {
    TypeId: Type.id,
    IngredientId: Ingredient.id
  }})
  return result[1]
}

module.exports = connectTypeWithIngredientService