const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

// router
const userRouter = require('./route/user')

app.use('/test', (req, res) => {
    res.send("/test")
})

app.use('/user', userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})