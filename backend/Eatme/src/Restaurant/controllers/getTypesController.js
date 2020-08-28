const { getTypesService } = require('../services')

async function getTypesController (req, res) {
    const types = await getTypesService()
    res.status(200).send({ types: types })
}

module.exports = getTypesController