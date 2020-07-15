const express = require('express')
const router = express.Router()
const { User } = require('../../models')

router.get('/get', (req, res) => {
    res.send('/test/get')
})

router.use('/insert', async (req, res) => {
 
    try {
        var result = await User.create({
            email: 'ramos@gmail.com',
            firstname: 'Sergio',
            lastname: 'Ramos',
            nickname: 'ramos4',
            password: 'ramos'
        })
        println(`RESULT: ${result}`)
    } catch(err) {
        console.error(err)
    }
    res.send('RESULT!!')
})


module.exports = router