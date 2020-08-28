var models = require('../../../models')

async function getDishesService (req, res) {
    const queriedDishes = await models.SingleDishWithType.findAll({
        include: [
          {
            model: models.Type,
            as: 'Type',
          },
          {
            model: models.DishIngredient,
            as: 'DishIngredients',
            include: [
              {
                model: models.Ingredient,
                as: 'Ingredient'
              }
            ]
          }
        ],
        order: [
          ['id', 'DESC']
        ]
      })
      var dishes = []

      queriedDishes.forEach(queriedDish => {
    
        var dish = { id: queriedDish.id, name: queriedDish.name, type: queriedDish.Type.name, ingredients: [] }
        
        queriedDish.DishIngredients.forEach(dishIngredient => {
          dish.ingredients.push(dishIngredient.Ingredient.name)
        })

        dishes.push(dish)
      })

      return dishes
}

module.exports = getDishesService