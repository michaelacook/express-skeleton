const express = require("express")
const router = express.Router()
const service = require("./user.service")

router.get("/", (req, res, next) => {
  try {
    res.json("users route")
  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const user = await service.findOne(req.params.id)
    return res.json(user)
  } catch (err) {
    next(err)
  }
})

module.exports = router
