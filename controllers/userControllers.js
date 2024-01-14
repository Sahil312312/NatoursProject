const express = require("express")


exports.getAllUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "allUsers",
    },
  });
};

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