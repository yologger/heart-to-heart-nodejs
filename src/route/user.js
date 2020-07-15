const express = require('express')
const router = express.Router()

router.use('/user', (req, res) => {
    res.send('/user/user')
})

module.exports = router
