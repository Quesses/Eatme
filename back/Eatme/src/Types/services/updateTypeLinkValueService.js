var models = require('../../../models')

async function updateTypeLinkValueService (typeId, linkValue) {
  const type = await models.Type.findOne({ 
    where : {
      id: typeId
    }
  })
  await type.update({
    linkValue: linkValue
  })

  return 1
}

module.exports = updateTypeLinkValueService