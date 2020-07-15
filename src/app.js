const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000;

app.use('/', morgan('dev'))
app.use('/', bodyParser.urlencoded({ extended: false }))
app.use('/', bodyParser.json())
app.use('/', cookieParser())

// routers
const userRouter = require('./route/user')

app.use('/test', (req, res) => {
    res.send("/test")
})

app.use('/user', userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})