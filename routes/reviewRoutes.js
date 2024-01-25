const express = require('express');
const app = express();
const reviewController = require('./../controllers/reviewController')

const router = express.Router();

router.route('/').get(reviewController.getAllReviews).post(reviewController.createReview)
router.route("/:id").get(reviewController.getSpecficReview)

module.exports = router;