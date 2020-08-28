'use strict';
module.exports = (sequelize, DataTypes) => {
  const TypeIngredient = sequelize.define('TypeIngredient', {
    TypeId: DataTypes.INTEGER,
    IngredientId: DataTypes.INTEGER
  }, {});
  TypeIngredient.associate = function(models) {
    TypeIngredient.belongsTo(models.Type, { foreignKey: 'TypeId', as: 'Type'})
    TypeIngredient.belongsTo(models.Ingredient, { foreignKey: 'IngredientId', as: 'Ingredient'})
  };
  return TypeIngredient;
};