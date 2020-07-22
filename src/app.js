const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

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

app.use('/', morgan('dev'))
app.use('/', bodyParser.urlencoded({ extended: false }))
app.use('/', bodyParser.json())
app.use('/', cookieParser())
app.use('/', passport.initialize())
app.use('/', passport.session())

app.use('/test', testRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/auth', authRouter)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    error.code = 404
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        "message": error.message,
        "code": error.code || 500
    })
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})
