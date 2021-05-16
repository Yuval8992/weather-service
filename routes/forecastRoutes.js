const express = require("express");
const forecastController = require("../controllers/forecastController");

const router = express.Router();

router.route("/data").get(forecastController.getForecastsByLocation);
router.route("/summarize").get(forecastController.getSummarizeByLocation);

module.exports = router;
