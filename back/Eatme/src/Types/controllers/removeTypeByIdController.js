const { removeTypeByIdService } = require('../services')

async function removeTypeByIdController (req, res) {
  const id = req.params.id
  await removeTypeByIdService(id)
  res.sendStatus(200)
}

module.exports = removeTypeByIdController