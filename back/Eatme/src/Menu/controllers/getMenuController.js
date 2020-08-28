const { getMenuService } = require('../services')

async function getTypesController (req, res) {
    const menu = await getMenuService()
    res.status(200).send({ menu: menu })
}

module.exports = getTypesController