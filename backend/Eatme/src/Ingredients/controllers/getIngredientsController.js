const { getIngredientsService } = require('../services')

async function getIngredientsController (req, res) {
    const ingredients = await getIngredientsService()
    res.status(200).send({ ingredients: ingredients })
}

module.exports = getIngredientsController