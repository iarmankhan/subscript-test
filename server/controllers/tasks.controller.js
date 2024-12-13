const projectsService = require("../services/projects");
const tasksService = require("../services/tasks");

const tasksController = {
  createTask: async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const task = await tasksService.createTask(
      req.project.id,
      {
        title,
        description,
      },
      req.user.id
    );
    res.json(task);
  },

  getTasks: async (req, res) => {
    const tasks = await tasksService.getTasks(req.project.id);
    res.json(tasks);
  },

  getTask: async (req, res) => {
    res.json(req.task);
  },

  updateTask: async (req, res) => {
    const { title, description } = req.body;

    if (!title && !description) {
      return res
        .status(400)
        .json({ message: "Title or description is required" });
    }

    const task = await tasksService.updateTask(req.params.id, {
      title,
      description,
    });

    res.json(task);
  },

  deleteTask: async (req, res) => {
    const task = await tasksService.deleteTask(req.params.id);

    res.json(task);
  },

  assignTask: async (req, res) => {
    const projectMemberId = req.params.projectMemberId;

    const projectMemberExists = await projectsService.doesProjectMemberExist(
      req.project.id,
      projectMemberId
    );

    if (!projectMemberExists) {
      return res.status(404).json({ message: "Project member not found" });
    }

    const task = await tasksService.assignTask(req.params.id, projectMemberId);

    res.json(task);
  },

  unassignTask: async (req, res) => {
    const projectMemberId = req.params.projectMemberId;

    const projectMemberExists = await projectsService.doesProjectMemberExist(
      req.project.id,
      projectMemberId
    );

    if (!projectMemberExists) {
      return res.status(404).json({ message: "Project member not found" });
    }

    const task = await tasksService.unassignTask(
      req.params.id,
      projectMemberId
    );

    res.json(task);
  },

  createComment: async (req, res) => {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await tasksService.createComment(
      req.params.id,
      req.user.id,
      content
    );

    res.json(comment);
  },

  deleteComment: async (req, res) => {
    const comment = await tasksService.getComment(
      req.params.id,
      req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.created_by !== req.user.id &&
      req.org.org_member_role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });
    }

    const deletedComment = await tasksService.deleteComment(
      req.params.id,
      req.params.commentId
    );

    res.json(deletedComment);
  },
};

module.exports = tasksController;
