const knex = require("../database/connection");

const projectsService = {
  createProject: async ({ name, description }, orgId, orgMemberId) => {
    const project = await knex("projects")
      .insert({
        name,
        description,
        org_id: orgId,
        created_by: orgMemberId,
      })
      .returning("*");

    return project;
  },
  // @todo - add validation to only return projects that the user has access to
  getProjects: async (orgId, orgMemberId, orgMemberRole) => {
    if (orgMemberRole === "admin") {
      const projects = await knex("projects")
        .where("org_id", orgId)
        .select("*");
      return projects;
    }

    const projects = await knex("projects")
      .leftJoin("project_members", "projects.id", "project_members.project_id")
      .where("projects.org_id", orgId)
      .andWhere("project_members.org_member_id", orgMemberId)
      .select("*");

    return projects;
  },

  getProject: async (id, orgId, orgMemberId, orgMemberRole) => {
    if (orgMemberRole === "admin") {
      const project = await knex("projects")
        .where("projects.id", id)
        .andWhere("projects.org_id", orgId)
        .first();
      return project;
    }

    const project = await knex("projects")
      .leftJoin("project_members", "projects.id", "project_members.project_id")
      .where("projects.id", id)
      .andWhere("projects.org_id", orgId)
      .andWhere("project_members.org_member_id", orgMemberId)
      .first();

    return project;
  },

  updateProject: async (id, { name, description }, orgId) => {
    const project = await projectsService.getProject(
      id,
      orgId,
      undefined,
      "admin"
    );

    if (!project) {
      return null;
    }

    const updatedProject = await knex("projects")
      .where("id", id)
      .andWhere("org_id", orgId)
      .update({ name, description })
      .returning("*");

    return updatedProject;
  },

  deleteProject: async (id, orgId) => {
    const project = await knex("projects")
      .where("id", id)
      .andWhere("org_id", orgId)
      .delete();

    return project;
  },

  addProjectMember: async (projectId, orgMemberId) => {
    const projectMember = await knex("project_members")
      .insert({
        project_id: projectId,
        org_member_id: orgMemberId,
      })
      .onConflict(["project_id", "org_member_id"])
      .ignore()
      .returning("*");

    return projectMember;
  },

  removeProjectMember: async (projectId, orgMemberId) => {
    const projectMember = await knex("project_members")
      .where("project_id", projectId)
      .andWhere("org_member_id", orgMemberId)
      .delete();

    return projectMember;
  },

  doesProjectMemberExist: async (projectId, projectMemberId) => {
    const projectMember = await knex("project_members")
      .where("project_id", projectId)
      .andWhere("id", projectMemberId)
      .first();

    return !!projectMember;
  },
};

module.exports = projectsService;
