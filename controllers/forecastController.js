const AppError = require("../utils/appError");
const Forecast = require("../models/ForecastModel");

exports.getForecastsByLocation = async (req, res, next) => {
  try {
    if (req.query.lat && req.query.lon) {
      const filter = {
        latitude: req.query.lat,
        longitude: req.query.lon,
      };

      const result = await Forecast.find(filter).select(
        "-_id forecastTime temperature precipitation"
      );
      if (!result.length) {
        return next(
          new AppError("there is no location with those params.", 404)
        );
      }

      res.status(200).json({
        status: 200,
        results: result.length,
        data: {
          data: result,
        },
      });
    } else {
      return next(new AppError("lat and lon params are required.", 404));
    }
  } catch (err) {
    next(err);
  }
};

exports.getSummarizeByLocation = async (req, res, next) => {
  try {
    if (req.query.lat && req.query.lon) {
      const stats = await Forecast.aggregate([
        {
          $match: { latitude: +req.query.lat, longitude: +req.query.lon },
        },
        {
          $group: {
            _id: "null",
            maxTemperature: { $max: "$temperature" },
            minTemperature: { $min: "$temperature" },
            avgTemperature: { $avg: "$temperature" },
            maxPrecipitation: { $max: "$precipitation" },
            minPrecipitation: { $min: "$precipitation" },
            avgPrecipitation: { $avg: "$precipitation" },
          },
        },
      ]);

      if (!stats.length) {
        return next(
          new AppError("there is no location with those params.", 404)
        );
      }

      const result = {
        max: {
          temperature: stats[0].maxTemperature,
          precipitation: stats[0].maxPrecipitation,
        },
        min: {
          temperature: stats[0].minTemperature,
          precipitation: stats[0].minPrecipitation,
        },
        avg: {
          temperature: stats[0].avgTemperature,
          precipitation: stats[0].avgPrecipitation,
        },
      };

      res.status(200).json({
        status: 200,
        data: {
          result,
        },
      });
    } else {
      return next(new AppError("lat and lon params are required.", 404));
    }
  } catch (err) {
    next(err);
  }
};
