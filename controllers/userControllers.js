const express = require("express");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...reqFeild) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (reqFeild.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "Success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getSpecficUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "A",
    },
  });
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(        'This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  const obj = filterObj(req.body, "name", "email");
//here we used findbyIDandUpdate because in this route we have no interaction with password feild
  const updateUser = await User.findByIdAndUpdate(req.user.id,obj,{
    new:true,
    validator:true
  })

  res.status(200).json({
    status: "Success",
    data:{
      user:updateUser
    }
  });
});

exports.deleteMe = catchAsync(async(req,res,next)=>{
  console.log(req.user.id);
  await User.findByIdAndUpdate(req.user.id,{active:false});

  res.status(204).json({
    status: 'success',
    data: null
  });
})

exports.createUser = (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      user: "newUser",
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "user updated",
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: "success",
    data: "user Deleted",
  });
};

