const knex = require("../database/connection");

const tasksService = {
  createTask: async (projectId, { title, description }, userId) => {
    console.log(projectId, title, description, userId);
    const task = await knex("tasks")
      .insert({
        project_id: projectId,
        title: title,
        description: description,
        created_by: userId,
      })
      .returning("*");

    return task;
  },

  getTasks: async (projectId) => {
    const tasks = await knex("tasks")
      .where("project_id", projectId)
      .select("*");

    return tasks;
  },

  getTask: async (id) => {
    const task = await knex("tasks").where("id", id).select("*");

    return task;
  },

  updateTask: async (id, { title, description }) => {
    const updateTask = await knex("tasks")
      .where("id", id)
      .update({ title, description })
      .returning("*");

    return updateTask;
  },

  deleteTask: async (id) => {
    const deletedTask = await knex("tasks").where("id", id).delete();
    return deletedTask;
  },

  assignTask: async (id, projectMemberId) => {
    const assignedTask = await knex("task_assignees")
      .insert({
        task_id: id,
        project_member_id: projectMemberId,
      })
      .returning("*");

    return assignedTask;
  },

  unassignTask: async (id, projectMemberId) => {
    const unassignedTask = await knex("task_assignees")
      .where("task_id", id)
      .andWhere("project_member_id", projectMemberId)
      .delete();

    return unassignedTask;
  },

  getComments: async (id) => {
    const comments = await knex("comments").where("task_id", id).select("*");

    return comments;
  },

  getComment: async (id, commentId) => {
    const comment = await knex("comments")
      .where("id", commentId)
      .andWhere("task_id", id)
      .select("*");

    return comment;
  },

  createComment: async (id, userId, content) => {
    const comment = await knex("comments").insert({
      task_id: id,
      content: content,
      created_by: userId,
    });

    return comment;
  },

  deleteComment: async (id, commentId) => {
    const deletedComment = await knex("comments")
      .where("id", commentId)
      .andWhere("task_id", id)
      .delete();

    return deletedComment;
  },
};

module.exports = tasksService;
