const catchAsync = require("../utils/catchAsync");
const Tour = require("./../models/tourModel")
const Review = require("./../models/reveiwModel");
const User = require("../models/userModel");
const AppErr = require("./../utils/appError");
const APIFeature = require("../utils/APIfeature");

exports.createReview = catchAsync(async(req,res,next)=>{
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
const features = new APIFeature(Review.find(), req.query)
    .filter()
    .sort()
    .limitFeilds();

  const review = await features.query;

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

