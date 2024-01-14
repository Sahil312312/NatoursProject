const express = require("express")
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')


exports.getAllUser = catchAsync(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        status:"Success",
        results:users.length,
        data:{
            users
        }
    })
})

 exports.getSpecficUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "A",
    },
  });
};

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