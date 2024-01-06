var express = require("express");
var router = express.Router();
var departmentController = require("../controllers/departmentController");

router
  .route("/")
  .get(departmentController.getAllDepartments)
  .post(departmentController.createDepartment);
router
  .route("/:id")
  .get(departmentController.getOneDepartment)
  .put(departmentController.updateDepartment)
  .delete(departmentController.deleteDepartment);

module.exports = router;
