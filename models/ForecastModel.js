const mongoose = require("mongoose");

const forecastScheme = new mongoose.Schema({
  longitude: {
    type: Number,
    required: [true, "A forecast must have a longitude"],
  },
  latitude: {
    type: Number,
    required: [true, "A forecast must have a latitude"],
  },
  forecastTime: {
    type: String,
    required: [true, "A forecast must have a forecast time"],
  },
  temperature: {
    type: Number,
    required: [true, "A forecast must have a temperature"],
  },
  precipitation: {
    type: Number,
    required: [true, "A forecast must have a precipitation"],
  },
});

forecastScheme.index({ longitude: 1, latitude: 1 });

const Forecast = mongoose.model("Forecast", forecastScheme);

module.exports = Forecast;
