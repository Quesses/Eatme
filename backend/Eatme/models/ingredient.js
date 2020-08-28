'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    name: DataTypes.STRING
  }, {});
  Ingredient.associate = function(models) {
    Ingredient.hasMany(models.TypeIngredient, { foreignKey: 'IngredientId', as: 'TypeIngredients' })
    Ingredient.hasMany(models.DishIngredient, { foreignKey: 'IngredientId', as: 'DishIngredients' })
  };
  return Ingredient;
};