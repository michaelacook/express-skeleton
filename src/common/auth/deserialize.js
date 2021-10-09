const User = require("../../modules/user/user.model")

module.exports = (id, done) => {
  User.findByPk(id).then((user) => {
    if (user) {
      done(null, user.get())
    } else {
      done(user.errors, null)
    }
  })
}