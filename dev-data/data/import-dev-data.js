const NUMBER_OF_FILES = 3;

const mongoose = require("mongoose");
const csv = require("csvtojson");
const Forecast = require("../../models/ForecastModel");

const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log("DB connection successful!");
  console.log(process.argv[2] === "--import" ? "Uploading..." : "Deleting...");
};

// READ EXCEL FILES
async function uploadFiles() {
  let weatherData = [];
  for (let fileNumber = 1; fileNumber < NUMBER_OF_FILES + 1; ++fileNumber) {
    weatherData = await csv().fromFile(`${__dirname}/file${fileNumber}.csv`);
    await Forecast.insertMany(weatherData);
    console.log(`file${fileNumber} uploaded.`);
  }
}

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await uploadFiles();
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Forecast.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

connectDB().then(() => {
  if (process.argv[2] === "--import") {
    importData();
  } else if (process.argv[2] === "--delete") {
    deleteData();
  }
});
