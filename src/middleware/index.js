const jwt = require('jsonwebtoken')
const { User } = require('../../models')

exports.verifyAccessToken = async (req, res, next) => {
    try {
        var authHeader = req.headers.authorization

        if (authHeader.startsWith('Bearer ')) {
            var ex_access_token = authHeader.substring(7, authHeader.length)
            jwt.verify(ex_access_token, process.env.ACCESS_TOKEN_SECRET)

            var exUser = await User.findOne({
                where: { access_token: ex_access_token }
            })

            if (exUser) {
                next()
            } else {
                res.status(499).json({
                    code: 499,
                    message: 'Invalid access token.'
                });
            }

        } else {
            res.status(419).json({
                code: 419,
                message: `Authorization header must starts with Bearer.`
            });
        }

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: 'Access token has expired.'
            });
        }
        return res.status(401).json({
            code: 401,
            message: 'Invalid access token'
        });
    }
}

exports.verifyRefreshToken = (req, res, next) => {
    try {
        var refresh_token = req.body.refresh_token
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: 'Refresh token has expired.'
            });
        }
        return res.status(401).json({
            code: 401,
            message: 'Invalid refresh token'
        });
    }
}