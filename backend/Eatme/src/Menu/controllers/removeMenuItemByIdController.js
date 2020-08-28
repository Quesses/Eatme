const { removeMenuItemByIdService } = require('../services')

async function removeMenuItemByIdController (req, res) {
  const id = req.params.id
  await removeMenuItemByIdService(id)
  res.sendStatus(200)
}

module.exports = removeMenuItemByIdController