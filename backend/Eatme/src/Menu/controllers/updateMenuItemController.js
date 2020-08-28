const { updateMenuItemService } = require('../services')

async function updateMenuItemController (req, res) {
  const requestDto = req.body.menuItem

  await updateMenuItemService(requestDto)
  
  res.sendStatus(200)
}

module.exports = updateMenuItemController