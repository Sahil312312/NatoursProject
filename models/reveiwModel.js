const mongoose = require("mongoose");
const User = require("./userModel");

const reveiwSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt:{
      type:Date,
      default:Date.now()

    },
    tour: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Tour",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,

      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reveiwSchema.pre(/^find/,function(next){
  // this.populate({
  //   path:'tour',
  //   select:'name'
  // }).populate({
  //   path:'user',
  //   select:'name photo '
  // })
   this.populate({
    path:'user',
    select:'name photo '
  })
  next()
})

const Review = mongoose.model("Review", reveiwSchema);
module.exports = Review;
