var models = require('../../../models')
const { Op } = require("sequelize")

async function getCountOfMissingTranslationsService () {

  const countOfIngredients = await models.Ingredient.count()
  const countOfTypes = await models.Type.count()
  const countOfTranslations = await models.Translation.count({ 
    where: {
      translation: { [Op.not]: '' }
  }})

  const countOfLanguages = await models.Language.count()

  const totalMissingTranslationCount = ( (countOfIngredients + countOfTypes) * countOfLanguages ) - ( countOfTranslations ) 
  
  return totalMissingTranslationCount
}

module.exports = getCountOfMissingTranslationsService