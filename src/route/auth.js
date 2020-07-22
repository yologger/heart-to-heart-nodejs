const express = require('express')
const bcrypto = require('bcrypt')
const { User } = require('../../models')
const router = express.Router()

router.post('/signup', async (req, res, next) => {

    var email = req.body.email
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var password = req.body.password
    var nickname = req.body.nickname

    try {
        var exUser = await User.findOne({
            where: { email: email }
        })

        if (exUser) {
            var response = {
                "message": "Email already exists.",
                "code": -401
            }
            res.status(403)
            res.json(response)

        } else {
            var hash = await bcrypto.hash(password, 12)
            var result = await User.create({
                email: email,
                firstname: firstname,
                lastname: lastname,
                password: hash,
                nickname: nickname
            })
            var response = {
                "email": result.dataValues.email,
                "message": 'Successfully signed up.',
                "code": 201
            }
            res.status(201)
            res.json(response)
        }

    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.post('/login', (req, res) => {
    res.status(404)
    res.json({
        code: 3,
        message: "wqejlkqwejl"
    })
})

router.post('/logout', (req, res) => {
    console.log('/auth/logout')
})

module.exports = router