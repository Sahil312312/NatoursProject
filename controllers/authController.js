const {promisify} = require('util')
const User = require("./../models/userModel");

const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppErr = require("./../utils/appError");


const signToken = id =>{
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    photo: req?.body?.photo,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log(newUser._id);

  const token = signToken(newUser._id)

  res.status(201).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) if email and pass exist
  if (!email || !password) {
    return next(new AppErr("please provide email and password", 400));

  } //2)User exist
  const user = await User.findOne({ email }).select('+password');

  if(!user || !(await user.correctPassword(password,user.password))){
    return next(new AppErr("Incorrect email or password"))
  }

  //3)token to client

  const token = signToken(user._id);

  res.status(200).json({
    status: "sucess",
    token,
  });
});

exports.protect = catchAsync(async(req,res,next)=>{
  let token;
//1.)Get the token and check its presence
if(req.headers && req.headers.authorization?.startsWith('Bearer')){
  token = req.headers.authorization.split(' ')[1];
}

if(!token){
  return next(new AppErr('You are not logged in please loggin to get access',401))
}
//2.) validate token
const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
//3) check if user still exists
const freshUser = await User.findById(decoded.id);
if(!freshUser){
  return next(new AppErr('The user belonging to the token doees not exist'))
}
//4)check if user changed password after jwt is issued
 if(freshUser.changePasswordAfter(decoded.iat)){
  new AppErr('User recently changed password again',401)
 }
 req.user = freshUser;
  next();
})
