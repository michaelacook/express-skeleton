const express = require("express")
const router = express.Router()
const service = require("./index.service")
const middleware = require("./index.middleware")()

router.get("/", middleware, (req, res, next) => {
  try {
    return res.json(service.greeting())
  } catch (err) {
    next(err)
  }
})

module.exports = router
