var models = require('../../../models')

async function connectTypeWithSizeService (type, size) {
  const Type = await models.Type.findOne({ where: { name: type } })

  const result = await models.SizeType.findOrCreate({ where : {
    TypeId: Type.id,
    value: (size.value ? size.value : 0),
    unit: size.unit,
  }})
  return result[1]
}

module.exports = connectTypeWithSizeService