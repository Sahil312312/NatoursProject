const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require('./../controllers/authController')
const router = express.Router();
const reviewRouter = require('./../routes/reviewRoutes')
// const reviewController = require('./../controllers/reviewController');

//run only  if param is present and tour api is hit
//for checking valid id
// router.param("id", tourController.checkId);

router.use('/:tourId/reviews',reviewRouter)

router.route('/top-5-cheap').get(tourController.aliasTopFive,tourController.getAllTours)
router.route('/tour-stat').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router
  .route("/")
  .get(authController.protect,tourController.getAllTours)
  //chaining middleware
  .post(tourController.createTour);

router //in express everything is middleware and these route are also middleware call on specfic url
  .route("/:id")
  .get(tourController.getSpecicTour)
  .delete(authController.restrictTo('admin','lead-guide'),tourController.deleteTour)
  .patch(tourController.updateTour);

// router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('users'),reviewController.createReview)

module.exports = router;
