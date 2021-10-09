# Express Skeleton Project 
This Express project skeleton provides an opinionated fully bootstrapped project starter to get up and running quickly. The guiding principle is a disciplined approach emphasizing modularity, clean code and convenience. The structure is inspired by the [NestJS](https://nestjs.com/) node framework and aims to mimick a domain-driven design approach. It is highly recommended that you read this file before starting your project.

## Getting Started
To start using the skeleton project, clone the repo, peruse the `package.json` file to determine which dependencies you want to keep and which you don't, then run `npm install`. The rest of this readme is a guide to understanding and using the skeleton project.

## Project Structure
The `src` folder is divided into `common` - business logic or other functionality that is required across more than one module, and `modules` - folders each representing a single object noun in your application. In most cases, each module will contain a model, a controller, and a service.

**Note**: Each module directory in `src/modules` **must** be the singular resource name. E.g. `user`, `post`, `song`, etc.

#### Models 
Models map to application resources, or object nouns in your application and specify their properties. In the model file you require the Sequelize instance and write the model, and specify any associations with other models. This file can be named whatever you want, but it's recommended that you use `[moduleName].model.js`. 

#### Services 
Services provide reusability and a layer of abstraction for business logic. A module's service should handle database queries, data manipulation, file uploads and other business logic tasks. Services can be named whatever you want, but again, it's recommended that you use the `[moduleName].service.js` convention. Services are not mandatory, but are particularly useful when you want to reuse business logic tasks. Services also help you satisfy the Single Responsibility principle, keeping your controllers agnostic with respect to business logic.

#### Controllers 
Controllers specify URIs and handling incoming requests, providing the appropriate response to the client. Controllers should require their module's service and call it's methods on the appropriate requests. Because routes are programmatically created and used by the Express application in this project, all controller files **must** be named `[moduleName].controller.js`. 

#### Middleware 
Any middleware specific to an application domain can be written in a separate middleware file and required into the controller. You can write middleware functions directly into your routes, but this is not recommended. Middleware used across multiple modules should be placed in `/src/common/middlewares`.

Middleware for individual routes can be used as follows: 

```js 
// auth.middleware.js 

module.exports = () => {
  return async function(req, res, next) {
    const user = await User.findOne(req.user.id)

    if (user) {
      return next()
    }

    return res.status(401).json({ error: "Not Authorized" })
  }
}

// resource.controller.js

const authMiddleware = require("./auth.middleware)()

router.get("/some-resource", authMiddleware, (req, res, next) => {
  // send resource
})
```

Middleware you want to apply to all routes can be passed to the application instance in `app.js`. 

***

Outside the `src` directory, you will find the `database` directory, responsible for holding database configurations, migrations and seed files. The `bin` directory contains the application binary - there is no need to modify this file. The `public` directory contains all static assets. `views` contains your template files. If you're building an API, simply delete this folder and remove ejs as the template engine from `app.js`. 

## What's Included
This skeleton project not only provides a project structure and basic boilerplate, it also comes pre-configured with dependencies to get you up and running quickly. I chose these dependencies because I frequently use them, but they are common enough that you will probably want to keep them. If not, you can easily swap them out for the packages of your choice. The skeleton also comes with code formatting, automatic routing, and an authentication strategy and auth middleware.

### Routing
The project is set up to automatically require and use the routes you create in module controller files. The project reads folder names inside the `modules` directory and programmatically creates a pluralized version of the directory name using a package called [pluralize](https://www.npmjs.com/package/pluralize) and then uses the base name and it's routes in `app.js`. No need to require routers and pass them to the Express app manually. Just create a controller file in a domain module and write your routes. The project already contains a `users` module to demonstrate.

### Database 
By default, the project is set up to create and use a SQLite database with Sequelize for the ORM. SQLite was chosen for ease of development. To use a different database in production, simply add it to the production config options in `/database/config.js`. For instance, if you want to use PostgreSQL in production, run `npm i pg pg-hstore` and add the postgres dialect and options for production. You can also easily change any of the config options for your purposes. When creating a new domain model, simply require the sequelize instance from `/database/index.js` into your model file.

The configuration options determining where Sequelize reads and writes migration and seeders is specified in the `.sequelizerc` in the root directory of the project. By default, Sequelize is configured to read and write migration files to `/database/migrations` and to read and write seeders to `/database/seeders`. This can be changed, but for simplicity it is recommended that you leave the default config options intact as you may otherwise need to revise the structure of the project and it's boilerplate (and then why use a project skeleton at all?).

#### Creating and Running Migrations
While models should be created manually when using this project skeleton, migrations can be generated using the Sequelize CLI using the command `npx sequelize-cli migration:generate --name [migration-name]`. See the Sequelize [migrations documentation](https://sequelize.org/master/manual/migrations.html#migration-skeleton). Seed files can be generated using the command `npx sequelize cli seed:generate --name [seed-name]`. See the Sequelize [seeders documentation](https://sequelize.org/master/manual/migrations.html#creating-the-first-seed). To run migrations, simply run `npm run migrate`, and to run seeders, run `npm run seed`. To delete the current SQLite database and start over with a fresh file, run "npm run new-dev-db" and the old database will be deleted and a new one created and seeded.

### Authentication
This project comes with Passport.js, the local strategy pre-configured and authentication middleware. Simply require the authentication middleware closure and pass into routes you want protected.

### Code Formatting 
To format your code neatly, simply run `npm run format`. The format script uses [prettier](https://prettier.io/). By default it eliminates semicolons and makes all indentations two spaces. You can customize this behaviour to your preferences by altering the format script.

## Workflow 
This project skeleton is intended to be simple to use. In short, for each application resource, create a module folder inside `/src` corresponding to the name of the resource and create a model, controller and service. For protected routes, require and use the authentication middleware in `/src/common/middlewares`.

## Contributing 
Please submit a pull request if you think something can be improved! This is simply my preferred setup for a small to medium-sized project. I hope that it provides you with some speed and convenience getting a project started and that it doesn't take too long to understand the boilerplate. In addition to the project itself, if you believe anything in the readme could be clarified or made more helpful, please submit a pull request.