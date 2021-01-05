const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const hpp = require('hpp')

const date = new Date('Oct 13, 1991 17:22:10')
console.log(date)   // 1991-10-13T08:22:10.000Z
console.log(date.getMilliseconds())   // 1991-10-13T08:22:10.000Z

const logger = require('./logger')

require('dotenv').config()
const port = process.env.PORT || 8000;

// Seqeulize
const { sequelize } = require('../models/index');
sequelize.sync()

// Passport
const passport = require('passport')
const passportConfig = require('./passport')
passportConfig(passport)

// Router
const testRouter = require('./route/test')
const userRouter = require('./route/user')
const postRouter = require('./route/post')
const authRouter = require('./route/auth')

// Morgan
if (process.env.NODE_ENV === 'production') {
    app.use('/', morgan('combined'))
    app.use('/', helmet())
    app.use('/', hpp())
} else {
    app.use('/', morgan('dev'))
} 

// app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
// app.use('/', bodyParser.urlencoded({ extended: false }))
app.use('/', bodyParser.urlencoded({ extended: true }))
app.use('/', bodyParser.json())
app.use('/', cookieParser())
app.use('/', passport.initialize())
app.use('/', passport.session())
app.use('/test', testRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/auth', authRouter)


// 404 Error Handler
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    error.code = 404
    next(error)
});

// Error Handler
app.use((error, req, res, next) => {
    logger.info("Hello")
    logger.error(error.message)
    res.status(error.status || 500)
    res.json({
        "message": error.message,
        "code": error.code || 500
    })
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})