const { Router } = require("express");
const organisationsController = require("../controllers/organisations.controller");
const resolveOrg = require("../middlewares/org.middleware");
const orgAdminMiddleware = require("../middlewares/org-admin.middleware");

const router = new Router();

router.post("/", organisationsController.createOrganisation);

router.get("/", organisationsController.getOrganisations);

router.delete(
  "/:id",
  resolveOrg,
  orgAdminMiddleware,
  organisationsController.deleteOrganisation
);

router.get("/:id", resolveOrg, organisationsController.getOrganisation);

router.get("/:id/members", resolveOrg, organisationsController.getMembers);

router.post(
  "/:id/members",
  resolveOrg,
  orgAdminMiddleware,
  organisationsController.addMember
);

router.delete(
  "/:id/members/:memberId",
  resolveOrg,
  orgAdminMiddleware,
  organisationsController.deactivateMember
);

module.exports = router;
