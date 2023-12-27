var express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

var router = express.Router();

var validate = require("../validations/product");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(validate.validator(), productController.createProduct);
router
  .route("/:id")
  .get(productController.getProduct)
  .put(
    authController.protect,
    authController.restrictTo("admin", "publisher"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "publisher"),
    productController.deleteProduct
  );

module.exports = router;
