var models = require('../../../models')
const { createTranslationService } = require('../../Translations/services')

async function createTypeService (name) {
  const result = await models.Type.findOrCreate({ where: { name: name } })
  await createTranslationService(name, 'type')
  return result[1]
}

module.exports = createTypeService