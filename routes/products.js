var express = require("express");
const productController = require("../controllers/productController");
var router = express.Router();

var validate = require("../validations/product");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(validate.validator(), productController.createProduct);
router
  .route("/:id")
  .get(productController.getProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
