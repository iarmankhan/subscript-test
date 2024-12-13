const organisationsService = require("../services/organisations");

const resolveOrg = async (req, res, next) => {
  const orgId = req.params.orgId;

  if (!orgId) {
    return res.status(400).json({ message: "Org ID is required" });
  }

  const org = await organisationsService.getOrganisation(orgId, req.user.id);

  if (!org) {
    return res.status(404).json({ message: "Org not found" });
  }

  req.org = org;

  next();
};

module.exports = resolveOrg;
