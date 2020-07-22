const express = require('express')
const router = express.Router()
const { User } = require('../../models')

router.get('/test', (req , res) => {
    var person = {
        name: "ronaldo",
        nation: "portugal",
        age: 35
    }
    res.json(person)
})

router.get('/get', (req, res) => {
    res.send('/test/get')
})

router.use('/insert', async (req, res) => {
    try {
        var result = await User.create({
            email: 'kane@gmail.com',
            firstname: 'Sergio',
            lastname: 'Ramos',
            nickname: 'ramos4',
            password: 'ramos'
        })
        console.log(`RESULT: ${result.email}`)
    } catch(err) {
        console.error(err)
        res.send('ERROR')
    }
    res.send('SUCCESS!!')
})


module.exports = router