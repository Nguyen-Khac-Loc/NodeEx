const { body } = require("express-validator");
const message = require("../helper/message");
const util = require("util");
var options = {
  name: {
    min: 10,
    max: 80,
  },
  description: {
    min: 10,
    max: 80,
  },
  image: {},
  price: {
    checkPrice(value) {
      if (value < 0) {
        throw new Error(message.price_below_zero);
      }
      return true;
    },
  },
};
const productValidation = {
  validator: function () {
    return [
      body(
        "name",
        util.format(
          message.size_string_message,
          "userName",
          options.name.min,
          options.name.max
        )
      ).isLength(options.name),
      body(
        "description",
        util.format(
          message.size_string_message,
          "description",
          options.description.min,
          options.description.max
        )
      ).isLength(options.description),
      body("image", message.invalid_image_url).isURL(),
      body("price", message.invalid_price)
        .isNumeric()
        .custom(options.price.checkPrice),
    ];
  },
};

module.exports = productValidation;
