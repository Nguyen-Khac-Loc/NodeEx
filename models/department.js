const departmentSchema = require("../schema/department");

module.exports = {
  getAll: function () {
    return departmentSchema.find({});
  },
  getOne: function (id) {
    return departmentSchema.findById(id);
  },
  createOne: function (name) {
    return new departmentSchema(name).save();
  },
  updateOne: function (id, body) {
    return departmentSchema.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });
	},
  deleteOne: function (id) {
    return departmentSchema.findByIdAndDelete(id);
  },
};
