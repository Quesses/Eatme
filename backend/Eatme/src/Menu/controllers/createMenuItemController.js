const { createMenuItemService } = require('../services')

async function createMenuItemController (req, res) {
  const requestDto = req.body.menuItem
  await createMenuItemService(requestDto)
  res.sendStatus(201)
}

module.exports = createMenuItemController