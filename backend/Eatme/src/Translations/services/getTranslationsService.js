const models = require('../../../models')
const translation = require( '../../../models/phrase' )

async function getTranaslationsService () {

  const phrases = await models.Phrase.findAll({
    include: {
      model: models.Translation,
      as: 'Translations',
      include: {
        model: models.Language,
        as: 'Language'
      }
    },
    order: [
      ['id', 'ASC']
    ]
  })
  var results = []
  phrases.forEach(phrase => {
    var result = {
      id: phrase.id,
      phrase: phrase.phrase,
      source: phrase.source,
      translations: []
    }
    phrase.Translations.forEach(trans => {
      result.translations.push({ language: trans.Language, translation: trans.translation })
    })
    results.push(result)
  })

  return results
}

module.exports = getTranaslationsService