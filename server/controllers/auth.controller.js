const authService = require("../services/auth");

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const user = await authService.login(email, password);
      res.send(user);
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
  },
  register: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const user = await authService.register(name, email, password);
      res.send(user);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },
};

module.exports = authController;
