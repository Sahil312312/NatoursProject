const { promisify } = require("util");
const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");

const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppErr = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createSendToken = (statusCode,user, token,res) => {
  const cookiesOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 60 * 1000
    ),
    httpOnly: true,  //it ensure that browser can recive the cookie but cannot transform it
  };

  //secure true is used to define that cookies wil go only when connection is https

  if(process.env.NODE_ENV === "production") cookiesOption.secure =true;

  res.cookie("jwt", token, cookiesOption);

    user.password = undefined;


  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    photo: req?.body?.photo,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log(newUser._id);

  const token = signToken(newUser._id);

  createSendToken(201, newUser, token,res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) if email and pass exist
  if (!email || !password) {
    return next(new AppErr("please provide email and password", 400));
  } //2)User exist
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppErr("Incorrect email or password"));
  }

  //3)token to client

  const token = signToken(user._id);

  createSendToken(200, user, token,res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1.)Get the token and check its presence
  if (req.headers && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppErr("You are not logged in please loggin to get access", 401)
    );
  }
  //2.) validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppErr("The user belonging to the token doees not exist"));
  }
  //4)check if user changed password after jwt is issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    new AppErr("User recently changed password again", 401);
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  // to accept n number of arg
  return (req, res, next) => {
    //roles=[admin,lead-guide].include('user) => false
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErr("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

// exports.forgetPassword =catchAsync( async(req,res,next) => {
// //1.)get user based on posted email

// const user  =await User.findOne({email:req.body.email});

// if(!user){
//   return next(new AppErr('There is no user with this email'))
// }

// //2.) Generate reset token

// const resetToken = user.createPasswordResetToken();
// await user.save({validateBeforeSave:false});

// })

exports.resetPassword = (req, res, next) => {};

exports.updtaePassword = catchAsync(async (req, res, next) => {
  // get user from db
  let oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new AppErr("No user found"));
  }

  if (!newPassword || !oldPassword) {
    return next(new AppErr("Please provide valid password"));
  }

  //check te passsword is correct

  if (await user.correctPassword(oldPassword, user.password)) {
    user.password = newPassword;
    user.passwordConfirm = newPassword;
  } else {
    return next(new AppErr("Password does not matched"));
  }

  await user.save();

  //loguser in jwt

  const token = signToken(user._id);

  createSendToken(200, user, token,res);
});
