const { getIngredientByIdService } = require('../services')

async function getIngredientByIdController (req, res) {
    const id = req.params.id
    const ingredient = await getIngredientByIdService(id)
    res.status(200).send({ ingredient: ingredient })
}

module.exports = getIngredientByIdController