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

  getOrganisations: async (req, res) => {
    const organisations = await organisationsService.getOrganisations(
      req.user.id
    );
    res.json(organisations);
  },

  deleteOrganisation: async (req, res) => {
    const organisation = await organisationsService.deleteOrganisation(
      req.org.id
    );
    res.json(organisation);
  },

  getOrganisation: async (req, res) => {
    res.json(req.org);
  },

  getMembers: async (req, res) => {
    const members = await organisationsService.getMembers(req.org.id);
    res.json(members);
  },

  addMember: async (req, res) => {
    const { userId, role } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const member = await organisationsService.addMember(
      req.org.id,
      req.body.userId,
      role
    );
    res.json(member);
  },

  deactivateMember: async (req, res) => {
    const member = await organisationsService.deactivateMember(
      req.org.id,
      req.params.memberId
    );
    res.json(member);
  },
};

module.exports = organisationsController;
