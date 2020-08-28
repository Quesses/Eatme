var models = require('../../../models')

async function getTypesService () {
  
  const queriedTypes = await models.Type.findAll({
    include: [
      {
        model: models.SingleDishWithType,
        as: 'Dishes',
        required: true,
        include: {
          model: models.SingleDishWithPrice,
          as: 'MenuItems',
          required: true
        }
      }
    ],
    order: [
      ['id', 'DESC']
    ]
  })

  var types = []
  for(const queriedTypeIndex in queriedTypes) {

    const queriedType = queriedTypes[queriedTypeIndex]

    const linkValue = !!queriedType.linkValue ? queriedType.linkValue : queriedType.name
    const translation = await models.Phrase.findOne({
      where: {
        phrase: queriedType.name,
        source: 'type'
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
    var type = { 
      id: queriedType.id, 
      name: queriedType.name,
      linkValue: linkValue,
      translations: []
    }
    await translation.Translations.forEach(trans => {
      type.translations.push({ 
        lang: trans.Language.lang, 
        translation: !!trans.translation?trans.translation:queriedType.name
      })
    })
    types.push(type)

  }
  return types
}

module.exports = getTypesService