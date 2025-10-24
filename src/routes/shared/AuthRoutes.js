const express = require("express");
const authValidator = require("../../validators/authValidator");
const AuthControllers = require("../../controllers/shared/AuthControllers");
const {
  handleRefreshToken,
} = require("../../controllers/shared/AuthControllers");
const route = express.Router();

route.post(
  "/login",
  authValidator.loginValidator,
  AuthControllers.loginController
);

route.post(
  "/register",
  authValidator.registerValidator,
  AuthControllers.registerController
);

route.post("/token/refresh", handleRefreshToken);

module.exports = route;
