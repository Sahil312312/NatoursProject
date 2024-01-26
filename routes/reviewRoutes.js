const express = require('express');
const app = express();
const authController = require('./../controllers/authController')
const reviewController = require('./../controllers/reviewController')

const router = express.Router({mergeParams:true});

router.route('/').get(authController.protect,reviewController.getAllReviews).post(authController.protect,reviewController.createReview)
router.route("/:id").get(reviewController.getSpecficReview)

module.exports = router;