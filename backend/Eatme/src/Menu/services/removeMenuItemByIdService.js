var models = require('../../../models')

async function removeMenuItemByIdService (id) {
  console.log(id)
  models.SingleDishWithPrice.destroy({
    where: {
      SingleDishWithTypeId: id
    }
  })
}

module.exports = removeMenuItemByIdService