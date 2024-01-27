const catchAsync = require("../utils/catchAsync");
const Tour = require("./../models/tourModel")
const Review = require("./../models/reveiwModel");
const User = require("../models/userModel");
const AppErr = require("./../utils/appError");
const APIFeature = require("../utils/APIfeature");
const factory = require('./../controllers/handlerFactory')

exports.setIds = async(req,res,next) => {
 if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id 

    const tour = await  Tour.findById(req.body.tour);
    const user = await User.findById(req.body.user);

    if(!tour || !user){
        return next(new AppErr('Please provide correct tour and user IDs '))
    }
    next()
}

exports.createReview = factory.createOne(Review)

exports.getAllReviews = factory.getAllDocs(Review)

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

