const fs = require("fs");
const express = require("express");
const Tours = require("./../models/tourModel");
const e = require("express");
const Tour = require("./../models/tourModel");
const { match } = require("assert");
const APIFeature = require("./../utils/APIfeature");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require('./../controllers/handlerFactory')

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkBody = (req,res,next) => {
// console.log(req.body);
// if(!req.body.name){
//   return res.status(400).json({
//     status:"failed",
//   })
// }
// next();
// }

// exports.checkId = (req,res,next,val) =>{
//   if(req.params .id*1>tours.length){
//     return res.status(404).json({
//       status:"fail",
//       message:"Invalid ID"
//     })
//   }
//     next();

// }

exports.aliasTopFive = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingdAverage,price";
  req.query.feilds = "name,price,ratingAverage,summary,difficulty";
  next();
};

exports.getAllTours = factory.getAllDocs(Tours);

exports.getSpecicTour = catchAsync(async (req, res, next) => {
  const tour = await Tours.findOne({ _id: req.params.id }).populate('reviews');

  //return lgna imp h warna hum do return statement m phas jaiyge
  if (!tour) {
    return next(new AppError("No Tour Found", 404));
  }
  //findOne({_id:req.params.id}) = findById
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
  // const tourId = req.params.id * 1;
  // const tour = tours.find((el) => el.id === tourId);
});

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tours.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.createTour = factory.createOne(Tours);



exports.deleteTour = factory.deleteOne(Tours)



exports.updateTour = factory.updateOne(Tours)

//aggretation is like query limit group match

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tours.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRating: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 }, //1 for ascending
    },
    // {
    //   $match: { _id: { $ne: "EASY" } }, //not equal
    // },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  console.log(year);

  const plan = await Tour.aggregate([
    {
      $unwind: `$startDates`, //to make each element of array as different object
    },
    {
      $match: {
        //just to select document or selection
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31  `),
        },
      },
    },
    {
      $group: {
        // group and select field
        _id: { $month: `$startDates` },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0, //remove _id from reponse
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
