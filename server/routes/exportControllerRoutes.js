const express = require("express");
const router = express.Router();
const exportController = require("../controllers/exportController");

router.get("/download", exportController.exportCSV);

module.exports = router;
