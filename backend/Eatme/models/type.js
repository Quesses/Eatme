'use strict';
module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    name: DataTypes.STRING,
    linkValue: DataTypes.STRING
  }, {});
  Type.associate = function(models) {
    Type.hasMany(models.SizeType, { foreignKey: 'TypeId', as: 'Sizes' })
    Type.hasMany(models.SingleDishWithType, { foreignKey: 'TypeId', as: 'Dishes' })
    Type.hasMany(models.TypeIngredient, { foreignKey: 'TypeId', as: 'TypeIngredients' })
  };
  return Type;
};