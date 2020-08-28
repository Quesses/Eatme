var models = require('../../../models')

async function createMenuItemsService (requestDto) {
  const singleDishWithTypeId = requestDto.dishId
  const pricesWithSize = requestDto.prices
  return Promise.all(pricesWithSize.map(async obj => {
    await models.SingleDishWithPrice.findOrCreate({
      where: {
        SingleDishWithTypeId: singleDishWithTypeId,
        fixedPrice: obj.price,
        SizeTypeId: obj.sizeId
      }
    })
    return 1
  }))
}

module.exports = createMenuItemsService