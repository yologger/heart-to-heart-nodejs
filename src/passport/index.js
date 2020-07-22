const local = require('./LocalStrategy')

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.dataValues.id)
    })

    passport.deserializeUser((id, done) => {
        console.log('HERE IS deserializeUser')
    })

    local(passport)
}