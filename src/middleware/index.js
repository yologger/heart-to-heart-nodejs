const jwt = require('jsonwebtoken')
const { User } = require('../../models')

exports.verifyAccessToken = async (req, res, next) => {
    try {
        var authHeader = req.headers.authorization

        // (1)
        if (!authHeader) {
            return res.status(400).json({
                code: -001,
                message: 'There is no authorization header.'
            })

        } else {
            // (2)
            if (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer ')) {
                const accessToken = authHeader.substring(7, authHeader.length)

                // (3)
                jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

                var decoded = jwt.decode(accessToken);
                var exUser = await User.findOne({
                    where: { email: decoded.email }
                })

                if (!exUser) {
                    // (4)
                    res.status(401).json({
                        code: -005,
                        message: 'Invalid access token. User does not exists.'
                    })
                } else {
                    if (!exUser.dataValues.access_token) {
                        // (5)
                        res.status(401).json({
                            code: -005,
                            message: 'Access token has already been logged out.'
                        })
                    }

                    if (accessToken != exUser.dataValues.access_token) {
                        // (6)
                        res.status(499).json({
                            code: -006,
                            message: 'Old access token.'
                        })
                    } else {
                        next()
                    }
                }
            } else {
                res.status(400).json({
                    code: -2,
                    message: `Authorization header must starts with Bearer.`
                });
            }
        }

    } catch (error) {

        if (error.name === 'JsonWebTokenError') {
            // (3-1)
            return res.status(419).json({
                code: -003,
                message: 'Invalid access token.'
            })
        }
        // (3-2)
        return res.status(401).json({
            code: -004,
            message: 'Access token has expired.'
        })
    }
}

exports.verifyRefreshToken = async (req, res, next) => {
    try {
        var refreshToken = req.body.refresh_token

        // (1)
        if (!refreshToken) {
            res.status(400).json({
                code: -001,
                message: 'There is no refresh token in request body.'
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
                res.status(401).json({
                    code: -005,
                    message: 'Invalid refresh token. User does not exists.'
                })
            } else {
                if (!exUser.dataValues.refresh_token) {
                    // (4) 0
                    res.status(401).json({
                        code: -005,
                        message: 'Refresh token has already been logged out.'
                    })
                }

                if (refreshToken != exUser.dataValues.refresh_token) {
                    // (5) 0
                    res.status(499).json({
                        code: -006,
                        message: 'Old refresh token.'
                    })
                } else {
                    next()
                }
            }
        }

    } catch (error) {
        // (2-1)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                code: -001,
                message: 'Invalid refresh token.'
            })
        }
        // (2-2)
        return res.status(403).json({
            code: -002,
            message: 'Refresh token has expired.'
        })
    }
}