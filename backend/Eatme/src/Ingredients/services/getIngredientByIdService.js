var models = require('../../../models')

async function getIngredientByIdService (id) {

  const queriedIngredient = await models.Ingredient.findOne({
    attributes: ['id', 'name'],
    where: {
      id: id
    },
    include: [
      {
        model: models.DishIngredient,
        as: 'DishIngredients',
        include: {
          model: models.SingleDishWithType,
          as: 'Dish',
          include: {
            model: models.Type,
            as: 'Type',
            attributes: ['name']
          }
        }
      },
      {
        model: models.TypeIngredient,
        as: 'TypeIngredients',
        include: {
          model: models.Type,
          as: 'Type',
          attributes: ['name', 'id']
        }
      }
    ]
  })

  var ingredient = {
    id: queriedIngredient.id,
    name: queriedIngredient.name,
    dishes: [],
    types: []
  }
  ingredient.dishes = queriedIngredient.DishIngredients.map(dishIngredient => {
    const dish = dishIngredient.Dish
    return { id: dish.id, name: dish.name, type: dish.Type.name }
  })
  ingredient.types = queriedIngredient.TypeIngredients.reduce((result, typeIngredient) => {
    const type = typeIngredient.Type
    // isAnyDishOfType = ingredient.dishes.find(dish => dish.type === type.name)
    // if (!isAnyDishOfType) result.push(type.name)
    result.push({ id: type.id, name: type.name })
    return result
  }, [])

  return ingredient
}

module.exports = getIngredientByIdService