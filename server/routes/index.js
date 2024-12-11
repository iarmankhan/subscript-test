const { Router } = require("express");
const authRouter = require("./auth");
const passport = require("passport");
const organisationsRouter = require("./organisations");
const authMiddleware = require("../middlewares/auth.middleware");

const router = new Router();

router.use("/auth", authRouter);
router.use("/organisations", authMiddleware, organisationsRouter);

module.exports = router;
