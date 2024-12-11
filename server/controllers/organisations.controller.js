const organisationsService = require("../services/organisations");

const organisationsController = {
  createOrganisation: async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    try {
      const organisation = await organisationsService.createOrganisation(
        req.user.id,
        name,
        description
      );
      res.status(201).json(organisation);
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = organisationsController;
