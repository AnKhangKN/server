const AuthRoutes = require("./shared/AuthRoutes");
const UserRoutes = require("./shared/UserRoutes");
const UserRoutesAdmin = require("./admin/UserRoutes");

const routes = (app) => {
  // shared
  app.use("/api/auth", AuthRoutes);
  app.use("/api/user", UserRoutes);

  // user

  // admin
  app.use("/api/admin", UserRoutesAdmin);
};

module.exports = routes;
