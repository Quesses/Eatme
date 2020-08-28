'use strict';
module.exports = (sequelize, DataTypes) => {
  const Translation = sequelize.define('Translation', {
    PhraseId: DataTypes.INTEGER,
    LanguageId: DataTypes.INTEGER,
    translation: DataTypes.STRING
  }, {});
  Translation.associate = function(models) {
    Translation.belongsTo(models.Language, { foreignKey: 'LanguageId', as: 'Language' })
    Translation.belongsTo(models.Phrase, { foreignKey: 'PhraseId', as: 'Phrase' })
  };
  return Translation;
};