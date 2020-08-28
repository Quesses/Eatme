var models = require('../../../models')

async function removeDishByIdService (id) {
  models.DishIngredient.destroy({
    where: {
      SingleDishWithTypeId: id
    }
  })

  models.SingleDishWithPrice.destroy({
    where: {
      SingleDishWithTypeId: id
    }
  })

  models.SingleDishWithType.destroy({
    where: {
      id: id
    }
  })
  return
}

module.exports = removeDishByIdService