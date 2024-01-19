const fs = require("fs");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const Tour = require("./../../models/tourModel");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connected"));

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(data);
    console.log("Data loaded");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

importData()

// deleteData();
