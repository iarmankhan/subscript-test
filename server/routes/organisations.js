const { Router } = require("express");
const organisationsController = require("../controllers/organisations.controller");

const router = new Router();

router.post("/", organisationsController.createOrganisation);

module.exports = router;
