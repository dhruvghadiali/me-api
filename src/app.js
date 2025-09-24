require("colors");
require("module-alias/register");

const path = require("path");
const express = require("express");

var cors = require("cors");

const setupSwagger = require("@MEConfig/swagger");
const errorHandler = require("@MEMiddleware/error");
const publicRouter = require("@MERoutes/publicRouter");
const studentRouter = require("@MERoutes/studentRouter");
const schoolAdminRouter = require("@MERoutes/schoolAdminRouter");
const superAdminRouter = require("@MERoutes/superAdminRouter");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

setupSwagger(app);

app.use("/", publicRouter);
app.use("/student", studentRouter);
app.use("/super-admin/", superAdminRouter);
app.use("/school-admin/", schoolAdminRouter);
app.use((req, res) => {
  res.status(404);
  res.sendFile(path.join(__dirname, "errorPage", "invalidEndpoint.html"));
});
app.use(errorHandler);

module.exports = app;
