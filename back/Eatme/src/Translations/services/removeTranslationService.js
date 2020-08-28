var models = require('../../../models')

async function createTranslationService (phrase, source) {
  const Phrase = await models.Phrase.findOne({
    where: {
      phrase: phrase,
      source: source
    }
  })

  models.Translation.destroy({
    where: {
      PhraseId: Phrase.id
    }
  })

  models.Phrase.destroy({
    where: {
      id: Phrase.id
    }
  })
}

module.exports = createTranslationService