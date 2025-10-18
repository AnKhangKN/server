const express = require("express");
const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.use(errorHandler);

module.exports = app;
