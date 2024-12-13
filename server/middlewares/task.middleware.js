const tasksService = require("../services/tasks");

const resolveTask = async (req, res, next) => {
  const task = await tasksService.getTask(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  req.task = task;
  next();
};

module.exports = resolveTask;
