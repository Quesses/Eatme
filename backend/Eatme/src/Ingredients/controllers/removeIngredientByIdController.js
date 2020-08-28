const { removeIngredientByIdService } = require('../services')

async function removeIngredientByIdController (req, res) {
  const id = req.params.id
  await removeIngredientByIdService(id)
  res.sendStatus(200)
}

module.exports = removeIngredientByIdController