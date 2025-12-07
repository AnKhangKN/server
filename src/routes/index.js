const AuthRoutes = require("./shared/AuthRoutes");
const UserRoutes = require("./shared/UserRoutes");
const UserRoutesAdmin = require("./admin/UserRoutes");
const PostRoutesUser = require("./user/PostRoutes");
const UserRoutesUser = require("./user/UserRoutes");
const ChatRoutes = require("./shared/ChatRoutes");
const CommentRoutesUser = require("./user/CommentRoutes");
const HeartRoutesUser = require("./user/HeartRoutes");
const ReportRoutesAdmin = require("./admin/ReportRoutes");
const ReportRoutes = require("./shared/ReportRoutes");
const GroupUserRoutes = require("./user/GroupRoutes");
const SharedRoutesAdmin = require("./admin/SharedRoutes");
const DepartmentRoutesAdmin = require("./admin/DepartmentRoutes");

const routes = (app) => {
  // shared
  app.use("/api/shared", AuthRoutes);
  app.use("/api/shared", UserRoutes);
  app.use("/api/shared", ChatRoutes);
  app.use("/api/shared", ReportRoutes);

  // user
  app.use("/api/user", PostRoutesUser);
  app.use("/api/user", UserRoutesUser);
  app.use("/api/user", CommentRoutesUser);
  app.use("/api/user", HeartRoutesUser);
  app.use("/api/user", GroupUserRoutes);

  // admin
  app.use("/api/admin", UserRoutesAdmin);
  app.use("/api/admin", ReportRoutesAdmin);
  app.use("/api/admin", SharedRoutesAdmin);
  app.use("/api/admin", DepartmentRoutesAdmin);
};

module.exports = routes;
