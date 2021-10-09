const Sequelize = require("sequelize")
const env = process.env.NODE_ENV || "development"
const config = require("./config")[env]

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config)

module.exports = sequelize
