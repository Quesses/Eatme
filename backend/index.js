const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors({ origin: ['http://localhost:8080', 'http://localhost:8081'] }))

app.use('/', require('./Eatme'))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port:${port}`))
