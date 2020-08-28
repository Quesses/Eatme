const { getDishByIdService } = require('../services')

async function getDishByIdController (req, res) {
    const id = req.params.id
    const dish = await getDishByIdService(id)
    res.status(200).send({ dish: dish })
}

module.exports = getDishByIdController