const { getMenuItemsOfTypeService } = require('../services')

async function getMenuItemsOfTypeController (req, res) {
    const type = req.params.type
    const menu = await getMenuItemsOfTypeService(type)
    res.status(200).send({ menu: menu })
}

module.exports = getMenuItemsOfTypeController