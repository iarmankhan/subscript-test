const knex = require("../database/connection.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersService = require("./users.js");

const authService = {
  login: async (email, password) => {
    const user = await usersService.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate JWT
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token };
  },

  register: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await knex("users")
      .insert({
        name,
        email,
        password_hash: hashedPassword,
      })
      .returning("*");

    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  },
};

module.exports = authService;
