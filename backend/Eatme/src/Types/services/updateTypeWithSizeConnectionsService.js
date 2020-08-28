var models = require('../../../models')

async function updateTypeWithSizeConnectionsService (typeId, sizes) {
  const connections = await models.SizeType.findAll({ 
    where : {
      TypeId: typeId
    }
  })

  Promise.all(connections.map(async connection => {
    const healthCheck = sizes.find(size => {
      const sizeValue = (size.value ? size.value : 0)
      return (parseInt(sizeValue) === connection.value && size.unit === connection.unit)
    })

    if (!healthCheck) {
      await models.SizeType.destroy({
        where: {
          typeId: typeId,
          value: connection.value,
          unit: connection.unit
        }
      })
    }
  }))
  return 1
}

module.exports = updateTypeWithSizeConnectionsService