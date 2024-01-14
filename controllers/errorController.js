const AppError = require('./../utils/appError')
const handleCastErrorDB = err =>{
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message,400 )
}

const handleDuplicateErrorDB = (err) => {
  let value = err.keyValue.name
  const message = `Duplicate feild value ${value} Please use another value`
  return new AppError(message,400)
}

const handleValidationErrorDB = err =>{
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `invalid input data. ${errors.join('.  ')}`
  return new AppError(message,400)
}
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operation errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programming or other unnkown err
    // 1.Log error
    console.error(`Error `, err);
    //2.Send generic error
    res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });
  }
};

// Error handler middleWare
//kahi pr bhi err aayega woh apne aap isme aaeyga
//express provide us this func that is error kissi bhi middleware m ho apne aap err handling middleware m aajati h
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {...err}
    if(err.name==="CastError") error = handleCastErrorDB(error)
    if(err.code === 11000) error=handleDuplicateErrorDB(error)
    if(err.name === 'ValidationError') error = handleValidationErrorDB(error)
    sendErrorProd(error, res);
  }
};
