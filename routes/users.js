var express = require("express");
const { model } = require("mongoose");
const { use } = require(".");

var validate = require("../validations/user");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

var router = express.Router();

router.post("/signup", validate.validator(), authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:token", userController.resetPassword);

router.use(authController.protect);

router.get("/me", userController.getCurrentUser);
router.get("/logout", userController.logout);

router.use(authController.restrictTo("admin", "publisher"));

router
  .route("/")
  .get(userController.getAllUser)
  .post(validate.validator(), userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
