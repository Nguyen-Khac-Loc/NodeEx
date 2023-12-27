var express = require("express");
const { model } = require("mongoose");
const { use } = require(".");

var validate = require("../validations/user");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

var router = express.Router();

router.post("/signup", validate.validator(), authController.signup);
router.post("/login", authController.login);
router.get("/me", authController.protect, userController.getCurrentUser);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "publisher"),
    userController.getAllUser
  )
  .post(validate.validator(), userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .put(
    authController.protect,
    authController.restrictTo("admin", "publisher"),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "publisher"),
    userController.deleteUser
  );

module.exports = router;
