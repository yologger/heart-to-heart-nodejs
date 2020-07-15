const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { sequelize } = require('../models/index');
sequelize.sync()
const port = process.env.PORT || 8000;

// routers
const userRouter = require('./route/user')
const testRouter = require('./route/test')

app.use('/', morgan('dev'))
app.use('/', bodyParser.urlencoded({ extended: false }))
app.use('/', bodyParser.json())
app.use('/', cookieParser())

app.use('/user', userRouter)
app.use('/test', testRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})