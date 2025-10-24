const express = require("express");
const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const bodyParser = require("body-parser");
const { FRONT_END_ORIGIN } = require("./config/env");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: FRONT_END_ORIGIN, // frontend Vite
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.use(errorHandler);

module.exports = app;
