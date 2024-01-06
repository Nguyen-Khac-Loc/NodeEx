const productSchema = require("../schema/product");

module.exports = {
  getall: function (query) {
    var sort = {};
    var Search = {};
    if (query.sort) {
      if (query.sort[0] == "-") {
        sort[query.sort.substring(1)] = "desc";
      } else {
        sort[query.sort] = "asc";
      }
    }
    if (query.key) {
      Search.userName = new RegExp(query.key, "i");
    }
    var limit = parseInt(query.limit) || 2;
    var page = parseInt(query.page) || 1;
    var skip = (page - 1) * limit;
    return (
      productSchema
        .find(Search)
        .select("*")
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .find({})
        .exec()
    );
  },
  getOne: function (id) {
    return productSchema.findById(id);
  },
  getByName: function (name) {
    return productSchema.findOne({ name }).exec();
  },
  createProduct: function (product) {
    return new productSchema(product).save();
  },
  getById: function (id) {
    return productSchema.findById(id);
  },
};
