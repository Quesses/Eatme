var models = require('../../../models')

async function createDishService (dishName, typeName) {
  const type = await models.Type.findOne({ 
    where: { 
      name: typeName 
    } 
  })

  const result = await models.SingleDishWithType.findOrCreate({ 
    where: { 
      name: dishName,
      TypeId: type.id 
    }
  })
  return result[1]
}

module.exports = createDishService