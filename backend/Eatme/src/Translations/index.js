const router = require('express').Router()

const {
  getCountOfMissingTranslationsController,
  getTranslationsController,
  updateTranslationController
} = require('./controllers')

router.route('/count')
    .get(getCountOfMissingTranslationsController)

router.route('/update')
    .post(updateTranslationController)

router.route('/')
    .get(getTranslationsController)

module.exports = router