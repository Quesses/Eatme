const { getCountOfMissingTranslationsService } = require('../services')

async function getCountOfMissingTranslationsController (req, res) {
    const count = await getCountOfMissingTranslationsService()
    res.status(200).send({ countOfMissingTranslations: count })
}

module.exports = getCountOfMissingTranslationsController