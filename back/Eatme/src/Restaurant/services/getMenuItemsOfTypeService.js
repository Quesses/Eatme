var models = require('../../../models')
const { Sequelize } = require("sequelize")

async function getMenuItemsOfTypeService (type) {
  const queriedMenuItems = await models.SingleDishWithType.findAll({
      include: [
        {
          model: models.Type,
          as: 'Type',
          where: {
            name: type
          }
        },
        {
          model: models.DishIngredient,
          as: 'DishIngredients',
          include: {
            model: models.Ingredient,
            as: 'Ingredient'
          }
        },
        {
            model: models.SingleDishWithPrice,
            as: 'MenuItems',
            include: {
              model: models.SizeType,
              as: 'Size'
            }
        }
      ],
      order: [
        ['id', 'DESC']
      ]
    })

    var menu = []

    queriedMenuItems.forEach(queriedDish => {
      if (queriedDish.MenuItems.length === 0) {
        return
      }
      var menuItem = { 
        id: queriedDish.id,
        name: queriedDish.name,
        type: queriedDish.Type.name,
        ingredients: [],
        variants: []
      }

      queriedDish.DishIngredients.forEach(dishIngredient => {
        menuItem.ingredients.push(dishIngredient.Ingredient.name)
      })

      queriedDish.MenuItems.forEach(obj => {
        menuItem.variants.push({
          price: obj.fixedPrice,
          size: {
            id: obj.Size.id,
            value: obj.Size.value,
            unit: obj.Size.unit
          }
        })
      })


      menu.push(menuItem)
    })

    return menu
}

module.exports = getMenuItemsOfTypeService