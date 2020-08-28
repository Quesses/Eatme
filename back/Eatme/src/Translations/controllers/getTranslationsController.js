const { getTranslationsService } = require('../services')

async function getTranslationsController (req, res) {
    const translations = await getTranslationsService()
    res.status(200).send({ translations: translations })
}

module.exports = getTranslationsController