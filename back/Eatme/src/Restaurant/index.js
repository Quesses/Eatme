const router = require('express').Router()

const {
  getTypesController,
  getMenuItemsOfTypeController
} = require('./controllers')

router.route('/types')
    .get(getTypesController)

router.route('/menu/:type')
    .get(getMenuItemsOfTypeController)

module.exports = router