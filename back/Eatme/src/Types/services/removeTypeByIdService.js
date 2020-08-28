var models = require('../../../models')

const { removeTranslationService } = require('../../Translations/services')

async function removeTypeByIdService (id) {

  const type = await models.Type.findOne({
    where: {
      id: id
    }
  })

  
  removeTranslationService(type.name, 'type')

  models.SizeType.destroy({
    where: {
      typeId: id
    }
  })

  models.TypeIngredient.destroy({
    where: {
      typeId: id
    }
  })

  models.Type.destroy({
    where: {
      id: id
    }
  })
  return
}

module.exports = removeTypeByIdService