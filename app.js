const express = require("express");
const morgan = require("morgan");
const AppError = require('./utils/appError')
const globalErrorController = require('./controllers/errorController')
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRouter");

console.log(process.env.NODE_ENV);
app.use(express.json()); // middleware used for adding body to req comming from client so that we can get data from client in post request

//serving static file
app.use(express.static(`${__dirname}/public`));

//mounting the route

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


app.all('*',(req,res,next)=>{
  // res.status(404).json({
  //   status:'fail',
  //   message:`Can't find ${req.originalUrl} on this server!`
  //   })


  //agar next m koi bhi parameter daloge woh apne app err middleware k pass jaiyga
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
})


app.use(globalErrorController)

module.exports = app;
