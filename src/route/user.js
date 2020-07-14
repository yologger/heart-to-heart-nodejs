const express = require('express')
const router = express.Router()

router.use('/test', (req, res) => {
    res.send('/user/test')
})

module.exports = router
