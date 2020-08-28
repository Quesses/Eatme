'use strict';
module.exports = (sequelize, DataTypes) => {
  const DishIngredient = sequelize.define('DishIngredient', {
    SingleDishWithTypeId: DataTypes.INTEGER,
    IngredientId: DataTypes.INTEGER
  }, {});
  DishIngredient.associate = function(models) {
    DishIngredient.belongsTo(models.SingleDishWithType, { foreignKey: 'SingleDishWithTypeId', as: 'Dish' })
    DishIngredient.belongsTo(models.Ingredient, { foreignKey: 'IngredientId', as: 'Ingredient' })
  };
  return DishIngredient;
};