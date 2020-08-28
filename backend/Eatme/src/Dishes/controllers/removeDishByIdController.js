const { removeDishByIdService } = require('../services')

async function removeDishByIdController (req, res, next) {
  const id = req.params.id
  await removeDishByIdService(id)
  res.sendStatus(200)
  next()
}

module.exports = removeDishByIdController