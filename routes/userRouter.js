const express = require("express")
const userController = require('./../controllers/userControllers')

//creating sub applications

const router = express.Router();



router.route("/").get(userController.getAllUser).post(userController.createUser);
router
  .route("/:id")
  .get(userController.getSpecficUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

  module.exports = router 