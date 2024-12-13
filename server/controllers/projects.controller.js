const projectsService = require("../services/projects");

const projectsController = {
  createProject: async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const project = await projectsService.createProject(
      { name, description },
      req.org.id,
      req.org.org_member_id
    );

    res.status(201).json(project);
  },
  getProjects: async (req, res) => {
    const projects = await projectsService.getProjects(
      req.org.id,
      req.org.org_member_id,
      req.org.org_member_role
    );
    res.json(projects);
  },
  getProject: async (req, res) => {
    const project = await projectsService.getProject(
      req.params.id,
      req.org.id,
      req.org.org_member_id,
      req.org.org_member_role
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  },
  updateProject: async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedProject = await projectsService.updateProject(
      req.params.id,
      { name, description },
      req.org.id
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  },
  deleteProject: async (req, res) => {
    const project = await projectsService.deleteProject(
      req.params.id,
      req.org.id
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  },

  addProjectMember: async (req, res) => {
    const { org_member_id } = req.body;

    if (!org_member_id) {
      return res.status(400).json({ message: "Org member ID is required" });
    }

    const project = await projectsService.addProjectMember(
      req.params.id,
      org_member_id,
      req.org.id
    );

    res.json(project);
  },

  removeProjectMember: async (req, res) => {
    const project = await projectsService.removeProjectMember(
      req.params.id,
      req.params.memberId
    );
    res.json(project);
  },
};

module.exports = projectsController;
