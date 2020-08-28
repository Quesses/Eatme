var models = require('../../../models')

async function createTranslationService (phrase, source) {
  const Phrase = await models.Phrase.findOrCreate({
    where: {
      phrase: phrase,
      source: source
    }
  })
  const languages = await models.Language.findAll()
  return Promise.all(languages.map(async (lang) => {
    await models.Translation.findOrCreate({
        where: {
          PhraseId: Phrase[0].id,
          LanguageId: lang.id
        }
      })
  }))
}

module.exports = createTranslationService