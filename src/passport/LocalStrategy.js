const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const { User } = require('../../models/index.js')

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {

        try {
            var exuser = await User.findOne({
                where: { email }
            })

            if (exuser) {
                var result = await bcrypt.compare(password, exuser.dataValues.password)
                
                var user = {
                    id: exuser.dataValues.id,
                    email: exuser.dataValues.email,
                    firstName: exuser.dataValues.first_name,
                    lastName: exuser.dataValues.last_name,
                    nickname: exuser.dataValues.nickname
                }

                if (result) {
                    done(null, user)
                } else {
                    done(null, false, { 
                        code: -2,
                        message: 'Invalid Password' 
                    })
                }

            } else {
                done(null, false, { 
                    code: -1,
                    message: 'Invalid Email' 
                })
            }

        } catch (error) {
            // Passport error
            console.error(error)
            done(error)
        }
    }))
} 