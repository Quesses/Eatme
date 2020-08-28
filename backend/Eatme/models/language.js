'use strict';
module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    lang: DataTypes.STRING,
    label: DataTypes.STRING
  }, { timestamps: false });
  Language.associate = function(models) {
    Language.hasMany(models.Translation, { foreignKey: 'LanguageId', as: 'Translations' })
  };
  return Language;
};