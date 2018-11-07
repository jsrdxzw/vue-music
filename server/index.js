const express = require('express')
const app = express()
const api = require('./api')
const bodyParser = require('body-parser')
const PROT = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', api)

app.listen(PROT, function () {
  console.log('server is running at' + PROT)
})
