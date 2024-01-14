const express = require("express")
const userController = require('./../controllers/userControllers')
const authController = require('./../controllers/authController')
//creating sub applications

const router = express.Router();

router.post('/signUp',authController.signup); 
router.post('/logIn',authController.login); 

router.route("/").get(userController.getAllUser).post(userController.createUser);
router
  .route("/:id")
  .get(userController.getSpecficUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

  module.exports = router 