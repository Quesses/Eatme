var models = require('../../../models')

async function getDishByIdService (id) {

  const queriedDish = await models.SingleDishWithType.findOne({
    attributes: ['id', 'name'],
    where: {
      id: id
    },
    include: [
      {
        model: models.SingleDishWithPrice,
        as: 'MenuItems'
      }
    ]
  })

  var dish = {
    id: queriedDish.id,
    name: queriedDish.name,
    menuItems: []
  }

  dish.menuItems = queriedDish.MenuItems.map(menuItem => {
    return { id: menuItem.id } 
  })
  return dish
}

module.exports = getDishByIdService