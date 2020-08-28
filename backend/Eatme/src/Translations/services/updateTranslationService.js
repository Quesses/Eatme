var models = require('../../../models')

async function updateTranslationService (Obj) {
  const phrase = await models.Phrase.findOne({
    where: {
      id: Obj.id
    },
    include: {
      model: models.Translation,
      as: 'Translations',
      include: {
        model: models.Language,
        as: 'Language'
      }
    }
  })
  return Promise.all(phrase.Translations.map(async trans => {
    newTranslation = Obj.translations.find(translation => translation.language.id === trans.LanguageId)
    return await trans.update({
      translation: newTranslation.translation
    })
  }))
}
module.exports = updateTranslationService