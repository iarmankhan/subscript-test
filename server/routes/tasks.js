const { Router } = require("express");
const tasksController = require("../controllers/tasks.controller");
const resolveTask = require("../middlewares/task.middleware");

const router = new Router();

router.post("/", tasksController.createTask);
router.get("/", tasksController.getTasks);
router.get("/:id", resolveTask, tasksController.getTask);
router.put("/:id", resolveTask, tasksController.updateTask);
router.delete("/:id", resolveTask, tasksController.deleteTask);

router.post(
  "/:id/assign/:projectMemberId",
  resolveTask,
  tasksController.assignTask
);
router.delete(
  "/:id/unassign/:projectMemberId",
  resolveTask,
  tasksController.unassignTask
);

router.post("/:id/comments", resolveTask, tasksController.createComment);
router.delete(
  "/:id/comments/:commentId",
  resolveTask,
  tasksController.deleteComment
);

module.exports = router;
