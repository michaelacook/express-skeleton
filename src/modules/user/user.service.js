const User = require("./user.model")

module.exports = {
  async findOne(id) {
    return await User.findOne({
      where: {
        id,
      },
    })
  },
}
