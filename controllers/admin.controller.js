let adminModel = require("../models/admin.model");
let jwt = require("jsonwebtoken");
let nodemailer = require("nodemailer");
let eventModel = require("../models/event.model");
let addCounterModel = require("../models/addCounter.model");
let userModel = require("../models/user.model");
let counterNotificationModel = require("../models/counterNotification.model");
let coordinatorNotificationModel = require("../models/coordinatorNotification.model");
let submittedCountModel = require("../models/submittedCount.model");
let finalCountModel = require("../models/finalCount.model");
let rejectedCountModel = require("../models/rejectedcount.model");
let rejectedTotalCountModel = require("../models/rejectedTotalCount.model");

const registerAdmin = (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let userName = req.body.userName;
  let password = req.body.password;
  // let form = new adminModel(req.body);
  userModel
    .findOne({ email: email, userName: userName })
    .then((user) => {
      console.log(user, "user");
      let firstname = user.firstname;
      let lastname = user.lastname;
      let gender = user.gender;
      let adminDetails = {
        email,
        userName,
        password,
        firstname,
        lastname,
        gender,
      };
      console.log(adminDetails, "admindetails");
      let form = new adminModel(adminDetails);
      form
        .save()
        .then(() => {
          console.log("Admin Saved Succesfully");
          res.send({
            status: true,
            message: "Sign up was succesful",
          });
          console.log(res.send.status);
        })
        .catch((err) => {
          console.log("error Saving");
          console.log(err);
          res.send({ status: false, message: "Sign up was not succesful" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: false, message: "Sign up was not succesful" });
    });
};

const signInAdmin = (req, res) => {
  console.log(req.body);
  let { email, password } = req.body;
  adminModel
    .findOne({ email: email })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.send({ status: false, message: "Does not exist" });
      } else {
        let secret = process.env.SECRET;
        user.validatePassword(password, (err, same) => {
          if (!same) {
            res.send({ status: false, message: "wrong credentials" });
          } else {
            let Admintoken = jwt.sign({ email }, secret, { expiresIn: "7h" });
            console.log(Admintoken);
            res.send({ status: true, message: "Welcome", Admintoken });
          }
        });
        console.log("Signin successful");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAdminPage = (req, res) => {
  let Admintoken = req.headers.authorization.split(" ")[1];
  let secret = process.env.SECRET;
  jwt.verify(Admintoken, secret, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ status: false, message: "Invalid Token" });
    } else {
      userModel
        .findOne({ email: result.email })
        .then((user) => {
          let firstname = user.firstname;
          let admin = user.userName;
          let AdminqrCode = user.userqrcode;
          console.log(firstname, "find one user");
          res.send({
            status: true,
            message: "Welcome",
            result,
            firstname,
            admin,
            AdminqrCode,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(result);
    }
  });
};

const getAdminMenu = (req, res) => {
  let form = new eventModel(req.body);
  form
    .save()
    .then(() => {
      console.log("Event Saved Succesfully");
      res.send({
        status: true,
        message: "Create Event was succesful",
      });
    })
    .catch((err) => {
      console.log("error Saving");
      console.log(err);
      res.send({
        status: false,
        message: "Sign up was not succesful",
      });
    });
};

const addCounter = (req, res) => {
  console.log(req.body, "addcounter body here");
  let form = new addCounterModel(req.body);
  form
    .save()
    .then(() => {
      console.log("Added Counters read Succesfully");
      res.send({
        staus: true,
        message: "Add Counter was succesful",
      });
    })
    .catch((err) => {
      console.log("error Saving");
      console.log(err);
      res.send({
        status: false,
        message: "Sign up was not succesful",
      });
    });
};

const sendCounterNotification = (req, res) => {
  console.log(req.body);
  let counter = req.body.counter;
  let admin = req.body.admin;
  let message = "sent";
  let notification = { counter, admin, message };
  console.log(notification, "noti", counter, "counter", admin, "admin");
  let form = new counterNotificationModel(notification);
  console.log(form, "form");
  form
    .save()
    .then(() => {
      console.log("Notification sent");
      res.send({
        status: true,
        message: "Notification sent successfully",
      });
      console.log(res.send.status);
    })
    .catch((err) => {
      console.log("error Saving");
      console.log(err);
      res.send({ status: false, message: "Sign up was not succesful" });
    });
};

const sendCoordinatorNotification = (req, res) => {
  console.log(req.body);
  let Coordinator = req.body.Coordinator;
  let admin = req.body.admin;
  let message = "sent";
  let notification = { Coordinator, admin, message };
  console.log(notification, "noti", Coordinator, "coordinator", admin, "admin");
  let form = new coordinatorNotificationModel(notification);
  console.log(form, "form");
  form
    .save()
    .then(() => {
      console.log("Notification sent");
      res.send({
        status: true,
        message: "Notification sent successfully",
      });
      console.log(res.send.status);
    })
    .catch((err) => {
      console.log("error Saving");
      console.log(err);
      res.send({ status: false, message: "Sign up was not succesful" });
    });
};

const getTotalCount = async (req, res) => {
  let coordinator = req.body.coordinator;
  let unique = req.body.unique;
  console.log(req.body, coordinator, unique, "this here");

  submittedCountModel
    .findOne({ coordinator: coordinator, uniqueId: unique })
    .then((count) => {
      if (count) {
        res.send({ status: true, message: "total count found", count });
      } else {
        res.send({ status: false, message: "total count not found" });
      }
    });
};

const finalCount = async (req, res) => {
  console.log(req.body, "final counts");
  let form = new finalCountModel(req.body.totalCount);
  form
    .save()
    .then((response) => {
      if (response) {
        res.send({ status: true, message: "Final Count saved" });
      } else {
        res.send({ status: false, message: "Final Count not saved" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getFinalCount = async (req, res) => {
  console.log(req.body, "wweeew");
  let coordinator = req.body.coordinator;
  let unique = req.body.unique;
  finalCountModel
    .findOne({ coordinator: coordinator, uniqueId: unique })
    .then((count) => {
      if (count) {
        res.send({ status: true, message: "total count found", count });
      } else {
        res.send({ status: false, message: "total count not found" });
      }
    });
};

const rejectCount = async (req, res) => {
  let rejected = req.body.totalCount;
  console.log(rejected, "rejected");
  try {
    let form = new rejectedTotalCountModel(rejected);
    form.save().then(async () => {
      let deletedCount = await submittedCountModel.findOneAndDelete({
        coordinator: rejected.coordinator,
        uniqueId: rejected.uniqueId,
      });
      if (deletedCount) {
        res.send({ status: true, message: "count rejected" });
        console.log("deleted");
      } else {
        res.send({ status: false, message: "count not rejected" });
        console.log("not deleted");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  registerAdmin,
  getAdminMenu,
  addCounter,
  getAdminPage,
  signInAdmin,
  sendCounterNotification,
  sendCoordinatorNotification,
  getTotalCount,
  finalCount,
  getFinalCount,
  rejectCount,
  // getAdminEvent,
};
