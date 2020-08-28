'use strict';
module.exports = (sequelize, DataTypes) => {
  const SingleDishWithPrice = sequelize.define('SingleDishWithPrice', {
    fixedPrice: DataTypes.INTEGER,
    SizeTypeId: DataTypes.INTEGER,
    SingleDishWithTypeId: DataTypes.INTEGER
  }, {});
  SingleDishWithPrice.associate = function(models) {
    SingleDishWithPrice.belongsTo(models.SizeType, { foreignKey: 'SizeTypeId', as: 'Size' })
    SingleDishWithPrice.belongsTo(models.SingleDishWithType, { foreignKey: 'SingleDishWithTypeId', as: 'Dish' })
  };
  return SingleDishWithPrice;
};