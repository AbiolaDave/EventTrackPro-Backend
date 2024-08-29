// List of imports
const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
let userRouter = require("./routes/users.route");
const cors = require("cors");
const userModel = require("./models/user.model");
let adminRouter = require("./routes/admin.route");
const adminModel = require("./models/admin.model");
const eventModel = require("./models/event.model");
const counterModel = require("./models/counter.Model");
const counterRouter = require("./routes/counter.route");
const countCoodinatorModel = require("./models/countCoordinator.model");
const countCoordinatorRouter = require("./routes/countCoordinator.route");

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/counter", counterRouter);
app.use("/countcoordinator", countCoordinatorRouter);

// Variable Declarations
let PORT = process.env.PORT;
let URI = process.env.URI;

// Connection
mongoose
  .connect(URI)
  .then(() => {
    console.log("mongodb success");
  })
  .catch((err) => {
    console.log(err);
    console.log("error encountered");
  });

app.listen(PORT, () => {
  console.log("App is listening at port" + PORT);
});
