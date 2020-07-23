const express = require('express')
const bcrypto = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { User } = require('../../models')
const { verifyAccessToken, verifyRefreshToken } = require('../middleware')
const router = express.Router()

router.get('/test', verifyAccessToken, (req, res) => {
    res.json({
        "code": 200,
        "data": {
            "message": "Success /auth/test~"
        }
    })
})

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

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {

        // Passport error
        if (error) {
            console.error(error)
            return next(error)
        }

        // User does not exist || Password incorrect
        if (!user) {
            return res.status(400).json({
                message: info.message,
                code: -001
            });
        }

        // Login
        req.login(user, { session: false }, async (error) => {
            try {
                if (error) {
                    return res.status(500).json({
                        "code": -002,
                        "message": error.message
                    })
                }

                var payload = {
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    nickname: user.nickname
                }

                var accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
                    issuer: process.env.TOKEN_ISSUER
                })

                var refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
                    issuer: process.env.TOKEN_ISSUER
                })

                await User.update({
                    access_token: accessToken,
                    refresh_token: refreshToken
                }, {
                    where: { email: user.email }
                })

                return res.status(201).json({
                    "code": 201,
                    "message": "Successfuly logged in.",
                    "data": {
                        "client_id": user.id,
                        "email": user.email,
                        "nickname": user.nickname,
                        "access_token": accessToken,
                        "refresh_token": refreshToken
                    }
                })

            } catch (error) {
                console.error(error)
                next(error.message)
            }
        })

    })(req, res, next);
});


router.post('/token', verifyRefreshToken, async (req, res) => {

    try {
        var ex_refresh_token = req.body.refresh_token

        var exUser = await User.findOne({
            where: { refresh_token: ex_refresh_token }
        })

        if (exUser) {

            var refresh_token_from_db = exUser.dataValues.refresh_token

            if (ex_refresh_token == refresh_token_from_db) {

                var payload = {
                    email: exUser.dataValues.email,
                    firstname: exUser.dataValues.firstname,
                    lastname: exUser.dataValues.lastname,
                    nickname: exUser.dataValues.nickname
                }

                const new_access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
                    issuer: process.env.TOKEN_ISSUER
                })

                const new_refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
                    issuer: process.env.TOKEN_ISSUER
                })

                await User.update({
                    access_token: new_access_token,
                    refresh_token: new_refresh_token
                }, {
                    where: { refresh_token: refresh_token_from_db }
                })

                res.status(201).json({
                    "code": 001,
                    "message": 'Tokens have been successfuly reissued. ',
                    "data": {
                        "client_id": exUser.dataValues.id,
                        "email": exUser.dataValues.email,
                        "nickname": exUser.dataValues.nickname,
                        "access_token": new_access_token,
                        "refresh_token": new_refresh_token
                    }
                })

            } else {
                var response = {
                    "message": "Invalid refresh token",
                    "code": -401
                }

                res.status(403)
                res.json(response)
            }
        } else {
            var response = {
                "message": "User does not exist.",
                "code": -401
            }

            res.status(403)
            res.json(response)
        }
    } catch (error) {
        console.error(error)
        next(error.message)
    }
})


router.post('/logout', verifyAccessToken, async (req, res) => {

    try {
        var authHeader = req.headers.authorization
        var accessToken = authHeader.substring(7, authHeader.length)

        var decoded = jwt.decode(accessToken);
        await User.update({
            access_token: null,
            refresh_token: null
        }, {
            where: {
                email: decoded.email
            }
        })

        res.status(202).json({
            code: 202,
            message: `Successfully logged out.`
        })

    } catch (error) {
        console.error(error)
        next(error)
    }
})

module.exports = router