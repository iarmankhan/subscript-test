const { Router } = require("express");
const authRouter = require("./auth");
const passport = require("passport");
const organisationsRouter = require("./organisations");
const authMiddleware = require("../middlewares/auth.middleware");
const resolveOrg = require("../middlewares/org.middleware");
const projectsRouter = require("./projects");
const tasksRouter = require("./tasks");
const projectMiddleware = require("../middlewares/project.middleware");

const router = new Router();

router.use("/auth", authRouter);
router.use("/organisations", authMiddleware, organisationsRouter);

router.use(
  "/organisations/:orgId/projects",
  authMiddleware,
  resolveOrg,
  projectsRouter
);

router.use(
  "/organisations/:orgId/projects/:projectId/tasks",
  authMiddleware,
  resolveOrg,
  projectMiddleware,
  tasksRouter
);

module.exports = router;
