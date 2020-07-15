const express = require('express')
const router = express.Router()

router.post('/signup', (req, res) => {
    console.log('/auth/signup')
})

router.post('/signup', (req, res) => {
    console.log('/auth/signup')
})

router.post('/logout', (req, res) => {
    console.log('/auth/logout')
})

module.exports = router