const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

//run only  if param is present and tour api is hit
//for checking valid id
// router.param("id", tourController.checkId);

router.route('/top-5-cheap').get(tourController.aliasTopFive,tourController.getAllTours)
router.route('/tour-stat').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router
  .route("/")
  .get(tourController.getAllTours)
  //chaining middleware
  .post(tourController.createTour);

router //in express everything is middleware and these route are also middleware call on specfic url
  .route("/:id")
  .get(tourController.getSpecicTour)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

module.exports = router;