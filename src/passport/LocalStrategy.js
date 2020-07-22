const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const { User } = require('../../models')

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
                    firstname: exuser.dataValues.firstname,
                    lastname: exuser.dataValues.lastname,
                    nickname: exuser.dataValues.nickname
                }

                if (result) {
                    done(null, user)
                } else {
                    done(null, false, { message: 'Password incorrect' })
                }

            } else {
                done(null, false, { message: 'User doesn not exist.' })
            }

        } catch (error) {
            // Passport error
            console.error(error)
            done(error)
        }
    }))
} 