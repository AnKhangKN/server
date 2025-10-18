const express = require("express");
const {
  loginValidator,
  registerValidator,
} = require("../../validators/authValidator");
const {
  loginController,
  registerController,
} = require("../../controllers/shared/AuthControllers");
const route = express.Router();

route.post("/login", loginValidator, loginController);

route.post("/register", registerValidator, registerController);

module.exports = route;
