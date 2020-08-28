var models = require('../../../models')

async function updateMenuItemsService (requestDto) {
  const singleDishWithTypeId = requestDto.dishId
  const pricesWithSize = requestDto.prices
  await Promise.all(pricesWithSize.map(async pws => {
    await models.SingleDishWithPrice.findOrCreate({
      where: {
        SingleDishWithTypeId: singleDishWithTypeId,
        fixedPrice: pws.price,
        SizeTypeId: pws.sizeId
      }
    })
    return 1
  }))

  const menuItems = await models.SingleDishWithPrice.findAll({
    where: {
      SingleDishWithTypeId: singleDishWithTypeId
    }
  })

  return Promise.all(menuItems.map(async menuItem => {
    const doesSameExist = pricesWithSize.find(pws => {
      return (parseInt(pws.price) === menuItem.fixedPrice && pws.sizeId === menuItem.SizeTypeId)
    })
    if (!doesSameExist) {
      await models.SingleDishWithPrice.destroy({
        where: {
          SingleDishWithTypeId: singleDishWithTypeId,
          fixedPrice: menuItem.fixedPrice,
          SizeTypeId: menuItem.SizeTypeId
        }
      })
    }
    return 1
  }))
}

module.exports = updateMenuItemsService