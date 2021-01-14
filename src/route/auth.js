const express = require('express')
const bcrypto = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { User } = require('../../models/index.js')
const { verifyAccessToken, verifyRefreshToken } = require('../middleware')
const router = express.Router()

router.post('/signup', async (req, res, next) => {

    var email = req.body.email
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var nickName = req.body.nickname
    var password = req.body.password

    try {
        var exUser = await User.findOne({
            where: { email: email }
        })

        if (exUser) {
            var response = {
                "code": -1,
                "error_message": "Email already exists."
            }
            res.status(403)
            res.json(response)

        } else {
            var hash = await bcrypto.hash(password, 12)

            var result = await User.create({
                email: email,
                first_name: firstName,
                last_name: lastName,
                nickname: nickName,
                password: hash
            })

            var response = {
                "code": 1,
                "message": 'Successfully signed up.',
                "data": {
                    "email": result.dataValues.email,
                    "nickname": result.dataValues.nickname
                }
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

        // Wrong Email || Wrong Password
        if (!user) {
            if (info.code == -1) {
                // Invalid Email
                return res.status(400).json({
                    "code": -1,
                    "error_message": info.message
                });
                
            } else {
                // Invalid Password
                return res.status(400).json({
                    "code": -2,
                    "error_message": info.message
                })
            }
        }

        // Login
        req.login(user, { session: false }, async (error) => {
            try {
                if (error) {
                    return res.status(500).json({
                        "code": -3, 
                        "error_message": error.message
                    })
                }

                var payload = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
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
                    "code": 1,
                    "message": "Successfuly logged in.",
                    "data": {
                        "user_id": user.id,
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

router.get('/token', verifyAccessToken, (req, res) => {
    console.log("GERERER")
    res.status(200).json({
        "code": 1,
        "message": "VALID TOKEN"
    })
})

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
                    "message": 'Tokens have been successfully reissued. ',
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
                    "code": -007,
                    "error_message": "Invalid Refresh token."
                }

                res.status(401).json(response)
            }
        } else {
            console.log("Invalid Refresh Token. User does not exist.")
            var response = {
                "code": -8,
                "error_message": "Invalid Refresh Token. User does not exist.",
            }
            res.status(401).json(response)
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
            code: 1,
            message: `Successfully logged out.`
        })

    } catch (error) {
        console.error(error)
        next(error)
    }
})

module.exports = router