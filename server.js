const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

//catching sync func
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log(`UNCAUGHT EXCEPTION: Shutting down.....`);
  server.close(() => {
    process.exit(1);
  });
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connected"));

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app is running on ${port}`);
});

//failed promises in async function
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION: Shutting down.....`);
  server.close(() => {
    process.exit(1);
  });
});



