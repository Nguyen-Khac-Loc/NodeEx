var mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: String,
});

schema.virtual("employees", {
  ref: "user",
  localField: "_id",
  foreignField: "department_k",
});
schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });

schema.pre(/^find/, function (next) {
  this.populate({
    path: "employees",
    select: "_id userName",
  });
  next();
});

module.exports = mongoose.model("department", schema);
