const { getTypeByIdService } = require('../services')

async function getTypeByIdController (req, res) {
    const id = req.params.id
    const type = await getTypeByIdService(id)
    res.status(200).send({ type: type })
}

module.exports = getTypeByIdController