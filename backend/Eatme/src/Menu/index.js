const router = require('express').Router()

const {
  createMenuItemController,
  getMenuController,
  updateMenuItemController,
  removeMenuItemByIdController
} = require('./controllers')

router.route('/')
    .post(createMenuItemController)

router.route('/')
    .get(getMenuController)

router.route('/update')
    .post(updateMenuItemController)

router.route('/:id')
    .delete(removeMenuItemByIdController)
    

module.exports = router