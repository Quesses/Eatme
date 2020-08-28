const router = require('express').Router()


router.use('/dishes', require('./src/Dishes'))
router.use('/ingredients', require('./src/Ingredients'))
router.use('/menu', require('./src/Menu'))
router.use('/translations', require('./src/Translations'))
router.use('/types', require('./src/Types'))

router.use('/restaurant', require('./src/Restaurant'))

module.exports = router