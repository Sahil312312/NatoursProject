const catchAsync = require("../utils/catchAsync");
const Tour = require("./../models/tourModel")
const Review = require("./../models/reveiwModel");
const User = require("../models/userModel");
const AppErr = require("./../utils/appError");
const APIFeature = require("../utils/APIfeature");

exports.createReview = catchAsync(async(req,res,next)=>{
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user._id 
    const {review,rating}  = req.body;
    const tourId = req.body.tour;
    const userId = req.body.user;
 
    const tour = await  Tour.findById(tourId);
    const user = await User.findById(userId);

    if(!tour || !user){
        return next(new AppErr('Please provide correct tour and user IDs '))
    }

    const reviewData = await Review.create(req.body)

    res.status(201).json({
    status: "success",
    data: {
      reviewData,
    },
  });

    
})

exports.getAllReviews = catchAsync(async(req,res,next)=>{
let filter = {};

if(req.params.tourId) filter = {tour : req.params.tourId}

  const review = await Review.find(filter);

  res.status(200).json({
    status: "success",
    result: review.length,
    data: {  
      review,
    },
  });


})

exports.getSpecficReview = catchAsync(async(req,res,next)=>{
 const reviewID  = req.params.id;
 const review = await Review.findById(reviewID);

 if(!review){
    return next(new AppErr('Please providse correct tour ID'))
 }

 res.status(200).json({
    status:"success",
    data:{
        review
    }
 })
})

