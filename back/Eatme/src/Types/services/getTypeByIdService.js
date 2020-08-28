var models = require('../../../models')

async function getIngredientByIdService (id) {

  const queriedType = await models.Type.findOne({
    attributes: ['id', 'name'],
    where: {
      id: id
    },
    include: [
      {
        model: models.SingleDishWithType,
        as: 'Dishes'
      }
    ]
  })

  var type = {
    id: queriedType.id,
    name: queriedType.name,
    dishes: []
  }

  type.dishes = queriedType.Dishes.map(dish => {
    return { name: dish.name, id: dish.id } 
  })
  return type
}

module.exports = getIngredientByIdService