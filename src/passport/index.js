const local = require('./LocalStrategy')

module.exports = (passport) => {
    console.log("Hello World!")
    local(passport)
}