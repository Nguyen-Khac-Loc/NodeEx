var responseData = require("../helper/responseData");
var productModel = require("../models/product");
const productSchema = require("../schema/product");
const { validationResult } = require("express-validator");
const getAllProducts = async function (req, res, next) {
  var products = await productModel.getall(req.query);
  responseData.responseReturn(res, 200, true, products);
};

const getProduct = async function (req, res, next) {
  // get by ID
  try {
    var product = await productModel.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(res, 404, false, `khong tim thay product`);
  }
};

const createProduct = async function (req, res, next) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    responseData.responseReturn(
      res,
      404,
      false,
      errors.array().map((error) => error.msg)
    );
    return;
  }
  var product = await productModel.getByName(req.body.name);
  if (product) {
    responseData.responseReturn(res, 404, false, "product da ton tai");
  } else {
    const newProduct = await productModel.createProduct({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
    });
    responseData.responseReturn(res, 200, true, newProduct);
  }
};
const updateProduct = async function (req, res, next) {
  try {
    var product = await productSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
      }
    );
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(
      res,
      404,
      false,
      `khong tim thay product. Error: ${error}`
    );
  }
};

const deleteProduct = function (req, res, next) {
  //delete by Id
  try {
    var product = productModel.findByIdAndDelete(req.params.id);
    responseData.responseReturn(res, 200, true, "xoa thanh cong");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay product");
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
