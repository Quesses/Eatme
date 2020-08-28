'use strict';
module.exports = (sequelize, DataTypes) => {
  const SingleDishWithType = sequelize.define('SingleDishWithType', {
    name: DataTypes.STRING,
    property: DataTypes.STRING,
    TypeId: DataTypes.INTEGER
  }, {});
  SingleDishWithType.associate = function(models) {
    SingleDishWithType.belongsTo(models.Type, { foreignKey: 'TypeId', as: 'Type' })
    SingleDishWithType.hasMany(models.DishIngredient, { foreignKey: 'SingleDishWithTypeId', as: 'DishIngredients' })
    SingleDishWithType.hasMany(models.SingleDishWithPrice, { foreignKey: 'SingleDishWithTypeId', as: 'MenuItems' })
  };
  return SingleDishWithType;
};