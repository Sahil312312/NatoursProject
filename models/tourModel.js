const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require('validator');
const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less than 40"],
      minlength: [10, "A tour name must have morre than 10"],
      // validate:[validator.isAlpha,"Tour name must only contain alpha numeric data"]
    },
    slug: {
      type: String,
    },
    ratingAverage: {
      type: Number,
      default: 4.7,
    },
    duration: {
      type: Number,
      required: [true, "required duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Must have group-size"],
    },
    difficulty: {
      type: String,
      required: [true, "Required"],
      enum: {
        //only for string
        values: ["easy", "medium", "difficult"],
        message: "error",
      },
    },
    price: {
      type: Number,
      required: [true, "price Must"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; //this keyword not work on update only for creating new document
        },
        message: "Disscount Failed ({VALUE})",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, "Must have image"],
    },
    image: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    sceretTour: {
      type: Boolean,
      default: false,
    },
    startLocation:{
      //GeoJson
      type:{
        type:String,
        default:"Point",
        enum:["Point"]
      },
      coordinates:[Number],
      adress:String,
      description:String,
    },
    loaction:[
      {
        type:{
          type:String,
          default:"Point",
          enum:["Point"]
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    ],
    guides:[
      {
        type : mongoose.Schema.ObjectId,
        ref:'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//to keep bussiness logic and application logic apart as much as possible
//fat model thin controller for bussiness logic

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE
//before actuall doc save to db
//only. save() .create but not in .insertMany()

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//embedding
// tourSchema.pre('save',async function(next){
//   const guidePromises =  this.guides.map(async id => await User.findById(id) ) 
//   this.guides =await Promise.all(guidePromises)
//   console.log();
// next();
// })

// //hook or middleware

// tourSchema.pre('save',function(next){
//   console.log('will save doc');
//   next();
// })

// //doc is document that is saved in db
// tourSchema.post('save',function(doc,next){
//   console.log(doc);
//   next();

// })

//QUERY MIDDLEWARE
// tourSchema.pre('find',function(next){
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next()
});

tourSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  this.find({ sceretTour: { $ne: true } }); //this point to query
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(Date.now() - this.start + " millisec");
  next();
});

//AGGREGATION MIDDLEWARE

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { sceretTour: { $ne: true } } }); //adding stage
  console.log(this);
  next();
});

//model middleware from documentation

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
