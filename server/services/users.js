const knex = require("../database/connection.js");

const usersService = {
  getUserById: async (id) => {
    const user = await knex("users").where({ id }).first();
    return user;
  },

  getUserByEmail: async (email) => {
    const user = await knex("users").where({ email }).first();
    return user;
  },
};

module.exports = usersService;
