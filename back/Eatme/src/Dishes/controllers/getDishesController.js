const { getDishesService } = require('../services')

async function getDishesController (req, res) {
    const dishes = await getDishesService()
    res.status(200).send({ dishes: dishes })
}

module.exports = getDishesController