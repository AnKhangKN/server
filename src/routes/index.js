const AuthRoutes = require("./shared/AuthRoutes");
const UserRoutes = require("./shared/UserRoutes");
const UserRoutesAdmin = require("./admin/UserRoutes");
const PostRoutesUser = require("./user/PostRoutes");
const UserRoutesUser = require("./user/UserRoutes");
const ChatRoutes = require("./shared/ChatRoutes");
const CommentRoutesUser = require("./user/CommentRoutes");
const HeartRoutesUser = require("./user/HeartRoutes");

const routes = (app) => {
  // shared
  app.use("/api/shared", AuthRoutes);
  app.use("/api/shared", UserRoutes);
  app.use("/api/shared", ChatRoutes);

  // user
  app.use("/api/user", PostRoutesUser);
  app.use("/api/user", UserRoutesUser);
  app.use("/api/user", CommentRoutesUser);
  app.use("/api/user", HeartRoutesUser);

  // admin
  app.use("/api/admin", UserRoutesAdmin);
};

module.exports = routes;
