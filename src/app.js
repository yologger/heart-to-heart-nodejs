const express = require('express')
const app = express()

// router
const userRouter = require('./route/user')

app.use('/test', (req, res) => {
    res.send("/test")
})

app.use('/user', userRouter)

app.listen(8000, () => {
    console.log('Server running on 8000 port.')
})