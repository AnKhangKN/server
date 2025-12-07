const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isAdmin } = require("../../middlewares/role.middleware");
const DepartmentControllers = require("@controllers/admin/DepartmentControllers");

const route = express.Router();

route.post(
  "/departments",
  verifyToken,
  isAdmin,
  DepartmentControllers.createDepartment
);

route.get(
  "/departments",
  verifyToken,
  isAdmin,
  DepartmentControllers.getDepartments
);

module.exports = route;
