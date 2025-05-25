require("colors");
require("module-alias/register");

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

var cors = require("cors");

const setupSwagger = require("@MEConfig/swagger");
const errorHandler = require("@MEMiddleware/error");
// const studentRouter = require("@MERoutes/studentRouter");
const schoolAdminRouter = require("@MERoutes/schoolAdminRouter");
const superAdminRouter = require("@MERoutes/superAdminRouter");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

setupSwagger(app);

(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(3000);

    // app.use("/", studentRouter);
    app.use("/super-admin/", superAdminRouter);
    app.use("/school-admin/", schoolAdminRouter);
    app.use((req, res) => {
      res.status(404);
      res.sendFile(path.join(__dirname, "errorPage", "invalidEndpoint.html"));
    });
    app.use(errorHandler);
  } catch (err) {
    console.log("error: " + err, process.env.DB_URI);
  }
})();
