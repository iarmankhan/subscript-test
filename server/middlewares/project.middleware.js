const projectsService = require("../services/projects");

const projectMiddleware = async (req, res, next) => {
  console.log(req.params.projectId);
  const project = await projectsService.getProject(
    req.params.projectId,
    req.org.id,
    req.org.org_member_id,
    req.org.org_member_role
  );

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  console.log(project);

  req.project = project;

  next();
};

module.exports = projectMiddleware;
