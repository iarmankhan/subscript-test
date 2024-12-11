const { Router } = require("express");
const authRouter = require("./auth");

const router = new Router();

router.use("/auth", authRouter);

module.exports = router;
