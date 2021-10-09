module.exports = () => {
  return function (req, res, next) {
    console.log("index middleware")
    next()
  }
}
