const express = require("express");
const router = express.Router();
const { getOrganizers } = require("../controllers/organizerController");

router.get("/", getOrganizers);

module.exports = router;
