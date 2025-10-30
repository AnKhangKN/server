const AuthRoutes = require("./shared/AuthRoutes");
const UserRoutes = require("./shared/UserRoutes");
const UserRoutesAdmin = require("./admin/UserRoutes");
const PostRoutesUser = require("./user/PostRoutes");
const UserRoutesUser = require("./user/UserRoutes");

const routes = (app) => {
  // shared
  app.use("/api/auth", AuthRoutes);
  app.use("/api/user", UserRoutes);

  // user
  app.use("/api/user", PostRoutesUser);
  app.use("/api/user", UserRoutesUser);

  // admin
  app.use("/api/admin", UserRoutesAdmin);
};

module.exports = routes;
