var models = require('../../../models')
const { createTranslationService } = require('../../Translations/services')


function createIngredientsService (ingredients) {
  return Promise.all(ingredients.map(async (ingredient) => {
    await models.Ingredient.findOrCreate({ where: { name: ingredient } })
    await createTranslationService(ingredient, 'ingredient')
  }))
}

module.exports = createIngredientsService