var models = require('../../../models')

async function getTypesService () {
  
  const queriedTypes = await models.Type.findAll({
    include: [
      {
        model: models.TypeIngredient,
        as: 'TypeIngredients',
        include: [{
          model: models.Ingredient,
          as: 'Ingredient'
        }]
      },
      {
        model: models.SizeType,
        as: 'Sizes',
        include: [
          {
            model: models.SingleDishWithPrice,
            as: 'Dishes',
            include: [
              {
                model: models.SingleDishWithType,
                as: 'Dish'
              }
            ]
          }
        ]
      },
      {
        model: models.SingleDishWithType,
        as: 'Dishes'
      }
    ],
    order: [
      ['id', 'DESC']
    ]
  })

  var types = []

  queriedTypes.forEach(queriedType => {

    var type = { 
      id: queriedType.id,
      name: queriedType.name,
      linkValue: queriedType.linkValue,
      ingredients: [],
      sizes: [],
      dishes: []
    }

    queriedType.TypeIngredients.forEach(typeIngredient => {
      type.ingredients.push(typeIngredient.Ingredient.name)
    })

    queriedType.Sizes.forEach(size => {
      const value = size.value
      const unit = size.unit
      const id = size.id
      const dishes = size.Dishes.map(dishWithPrice => {
        return { id: dishWithPrice.id, name: dishWithPrice.Dish.name }
      })
      type.sizes.push({ id: id, value: value, unit: unit, dishes: dishes })
    })

    queriedType.Dishes.forEach(dish => {
      type.dishes.push(dish)
    })
    types.push(type)
  })

  return types
}

module.exports = getTypesService