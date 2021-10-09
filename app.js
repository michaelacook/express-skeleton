const express = require("express")
const path = require("path")
const fs = require("fs")
const cookieParser = require("cookie-parser")
const pluralize = require("pluralize")
const passport = require("passport")
const authStrategy = require("./src/common/auth/strategy")
const serialize = require("./src/common/auth/serialize")
const deserialize = require("./src/common/auth/deserialize")
const session = require("express-session")
const logger = require("morgan")
const indexRoute = require("./src/modules/index.controller")
const app = express()

passport.serializeUser(serialize)
passport.deserializeUser(deserialize)
passport.use(authStrategy())

// view engine setup. modify for your purposes
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + 3600000),
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

// index route
// whatever you want to send to the client on home ("/") routes
app.use("/", indexRoute)

// login route
app.get("/login", (req, res) => {
  const user = req.session.passport ? req.session.passport.user || null : null
  // uncomment below and make a login page in views
  
  // res.render("login", {
  //   user,
  // })
  res.json("login GET route. create a login page")
})

// login
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/")
  }
)

// logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      next(err)
    } else {
      res.redirect("/login")
    }
  })
})

// programmatically require controllers and use pluralized route names for endpoints
// delete this code if you want to specify all your own URIs for endpoints
// you can still create custom endpoints before or after this block
fs.readdirSync(path.join(__dirname, "src", "modules"))
  .filter((entity) => !entity.includes("."))
  .forEach((dir) => {
    const contents = fs.readdirSync(path.join(__dirname, "src", "modules", dir))

    // if module contains a controller, create a route base name and use the routes
    if (contents.includes(`${dir}.controller.js`)) {
      const file = contents.filter((file) => file.includes("controller"))[0]
      const controller =
        require(path.join(__dirname, "src", "modules", dir, file))
      const noun = pluralize(path.basename(file.slice(0, file.indexOf("."))))

      // programmatically use the pluralized name of the controller and it's routes
      app.use(`/${noun}`, controller)
    }
  })

// catch 404. Use your own 404 page here
app.use(function (req, res, next) {
  res.status(404).json("Not Found")
})

// error handler
app.use((err, req, res) => {
  if (req.app.get("env") === "development") {
    // render the error page
    // res.status(err.status || 500).render("error") uncomment to render an error view
    res.status(err.status || 500).json({
      status: err.status,
      stack: err,
    })
  } else {
    // whatever you want the client to receive in production
  }
})

module.exports = app
