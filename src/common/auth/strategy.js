const LocalStrategy = require("passport-local").Strategy
const User = require("../../modules/user/user.model")
const bcrypt = require("bcrypt")

module.exports = () => {
  return new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({
      where: {
        email: username,
      },
    })
  
    if (!user) {
      console.log("user not found")
      return done(null, false, {
        message: "Incorrect email",
      })
    }
  
    if (!bcrypt.compareSync(password, user.password)) {
      console.log("wrong pass")
      return done(null, false, {
        message: "Incorrect password.",
      })
    }
    return done(null, user)
  })
}