'use strict';
module.exports = (sequelize, DataTypes) => {
  const SizeType = sequelize.define('SizeType', {
    value: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    TypeId: DataTypes.INTEGER
  }, {});
  SizeType.associate = function(models) {
    SizeType.hasMany(models.SingleDishWithPrice, { foreignKey: 'SizeTypeId', as: 'Dishes' })
    SizeType.belongsTo(models.Type, { foreignKey: 'TypeId', as: 'Type' })
  };
  return SizeType;
};