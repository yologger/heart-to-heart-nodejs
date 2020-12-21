const jwt = require('jsonwebtoken')
const { User } = require('../../models/index.js')

exports.verifyAccessToken = async (req, res, next) => {
    try {
        var authHeader = req.headers.authorization

        // (1) No Authorization Header
        if (!authHeader) {
            console.log("Access Token Error / No Authorization Header")
            return res.status(401).json({
                code: -001,
                error_message: 'Access Token Error / No Authorization Header'
            })

        } else {
            // (2) Authorization Header doesn't start with 'Bearer'.
            if (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer ')) {
                const accessToken = authHeader.substring(7, authHeader.length)

                // (3) Vertify Access Token
                jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

                var decoded = jwt.decode(accessToken);

                var exUser = await User.findOne({
                    where: { email: decoded.email }
                })

                if (!exUser) {
                    // (4) 
                    console.log('Access Token Error / Invalid Access Token. User does not exists')
                    res.status(401).json({
                        code: -005,
                        error_message: 'Access Token Error / Invalid Access Token. User does not exists'
                    })
                } else {
                    if (!exUser.dataValues.access_token) {
                        // (5)
                        console.log('Access Token Error / Invalid Access Token. User already has logged out')
                        res.status(401).json({
                            code: -006,
                            error_message: 'Access Token Error / Invalid Access Token. User already has logged out'
                        })
                    }

                    if (accessToken != exUser.dataValues.access_token) {
                        // (6)
                        console.log('Access Token Error / Invalid Access Token. Old Access Token')
                        res.status(401).json({
                            code: -007,
                            error_message: 'Access Token Error / Invalid Access Token. Old Access Token'
                        })
                    } else {
                        console.log("Access Token Success / Verifing Access Token succeed")
                        next()
                    }
                }
            } else {
                console.log("Access Token Error / Authorization Header doesn't start with Bearer")
                res.status(401).json({
                    code: -002,
                    error_message: `Access Token Error / Authorization Header must starts with Bearer`
                });
            }
        }

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            // (3-1) Invalid Access Token
            console.log("Access Token Error / Invalid Access Token")
            return res.status(401).json({
                code: -003,
                error_message: 'Access Token Error / Invalid Access Token'
            })
        }
        // (3-2) Access Token has expired
        console.log("Access Token Error / Access Token has expired")
        return res.status(401).json({
            code: -004,
            error_message: 'Access Token Error / Access Token has expired'
        })
    }
}

exports.verifyRefreshToken = async (req, res, next) => {

    try {
        var refreshToken = req.body.refresh_token
        // (1)
        console.log('Refresh Token Error / No Refresh Token in request body')
        if (!refreshToken) {
            res.status(401).json({
                "code": -11,
                "error_message": 'Refresh Token Error / No Refresh Token in request body'
            })

        } else {
            // (2)
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

            var decoded = jwt.decode(refreshToken);
            var exUser = await User.findOne({
                where: { email: decoded.email }
            })

            if (!exUser) {
                // (3) X
                console.log('Refresh Token Error / Invalid Refresh Token. User does not exists')
                res.status(401).json({
                    "code": -14,
                    "error_message": 'Refresh Token Error / Invalid Refresh Token. User does not exists'
                })
            } else {
                if (!exUser.dataValues.refresh_token) {
                    // (4) 0
                    console.log('Refresh Token Error / Invalid Refresh Token. User already has logged out')
                    res.status(401).json({
                        "code": -015,
                        "error_message": 'Refresh Token Error / Invalid Refresh Token. User already has logged out'
                    })
                }

                if (refreshToken != exUser.dataValues.refresh_token) {
                    // (5) 0
                    console.log('Refresh Token Error / Invalid Refresh Token. Old Refresh Token')
                    res.status(401).json({
                        "code": -016,
                        "error_message": 'Refresh Token Error / Invalid Refresh Token. Old Refresh Token'
                    })
                } else {
                    console.log("Refresh Token Success / Verifing Refresh Token succeed")
                    next()
                }
            }
        }

    } catch (error) {
        // (2-1)
        if (error.name === 'JsonWebTokenError') {
            console.log("Refresh Token Error / Invalid Refresh Token")
            return res.status(401).json({
                "code": -012,
                "error_message": 'Refresh Token Error / Invalid Refresh Token'
            })
        }
        // (2-2)
        console.log('Refresh Token Error / Refresh Token has expired')
        return res.status(401).json({
            "code": -013,
            "error_message": 'Refresh Token Error / Refresh Token has expired'
        })
    }
}