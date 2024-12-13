const { Router } = require("express");
const projectsController = require("../controllers/projects.controller");
const orgAdminMiddleware = require("../middlewares/org-admin.middleware");

const router = new Router();

router.post("/", orgAdminMiddleware, projectsController.createProject);
router.get("/", projectsController.getProjects);
router.get("/:id", projectsController.getProject);
router.patch("/:id", orgAdminMiddleware, projectsController.updateProject);
router.delete("/:id", orgAdminMiddleware, projectsController.deleteProject);

router.post(
  "/:id/members",
  orgAdminMiddleware,
  projectsController.addProjectMember
);

router.delete(
  "/:id/members/:memberId",
  orgAdminMiddleware,
  projectsController.removeProjectMember
);

module.exports = router;
