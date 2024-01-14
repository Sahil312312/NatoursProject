const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
dotenv.config({ path: "./../../config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((res) => console.log("Database Connected..."));

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
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

importData();
