const LocalStrategy = require('passport-local')

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {

        var user = await User.findOne({ where: {
            email: email, 
            provider: 'local'
        } });

        if (user) {
            var result = await bcrypt.compare(password, user.dataValues.password);
            if (result) {
                done(null, user);
            } else {
                done(null, false, { message: 'Password Incorrect.' });
            }
        } else {
            done(null, false, { message: 'User does not exist.' });
        }
    }))
} 