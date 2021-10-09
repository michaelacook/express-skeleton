"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "email@email.com",
          password:
            "$2a$04$s8toB/XEGtI9ZPSHc6lC/.iybvcOJHo8psAmkXfxZxU.HVkEDyM/i", // asdfasdf
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {})
  },
}
