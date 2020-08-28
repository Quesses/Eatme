const { updateTranslationService } = require('../services')

async function updateTranslationController (req, res) {
    const requestDto = req.body.phrase
    await updateTranslationService(requestDto)
    res.sendStatus(200)
}

module.exports = updateTranslationController