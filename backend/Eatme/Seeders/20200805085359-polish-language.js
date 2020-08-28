'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Languages', [{
      lang: 'pl',
      label: 'polish'
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Languages', null, {});
  }
};
