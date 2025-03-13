require("colors");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');

const errorHandler = require("./middleware/error");
const studentRouter = require("./router/studentRouter");
const schoolAdminRouter = require("./router/schoolAdminRouter");
const superAdminRouter = require("./router/superAdminRouter");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    app.listen(3000);

    app.use("/", studentRouter);
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