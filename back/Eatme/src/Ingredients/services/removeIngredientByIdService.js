var models = require('../../../models')

const { removeTranslationService } = require('../../Translations/services')

async function removeIngredientByIdService (id) {
  const ingr = await models.Ingredient.findOne({
    where: {
      id: id
    }
  })

  removeTranslationService(ingr.name, 'ingredient')

  models.DishIngredient.destroy({
    where: {
      ingredientId: id
    }
  })

  models.TypeIngredient.destroy({
    where: {
      ingredientId: id
    }
  })

  models.Ingredient.destroy({
    where: {
      id: id
    }
  })
  return
}

module.exports = removeIngredientByIdService