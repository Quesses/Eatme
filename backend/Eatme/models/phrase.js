'use strict';
module.exports = (sequelize, DataTypes) => {
  const Phrase = sequelize.define('Phrase', {
    phrase: DataTypes.STRING,
    source: DataTypes.STRING
  }, {});
  Phrase.associate = function(models) {
    Phrase.hasMany(models.Translation, { foreignKey: 'PhraseId', as: 'Translations' })
  };
  return Phrase;
};