const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/errorController");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRouter");



//// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max:100,
  windowMs: 60*60*1000,
  message:"Too many requests from this IP , please try again in an hour"
});
app.use('/api',limiter)


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist:[
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
)

//serving static file
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
//mounting the route
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  //agar next m koi bhi parameter daloge woh apne app err middleware k pass jaiyga
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController);

module.exports = app;
