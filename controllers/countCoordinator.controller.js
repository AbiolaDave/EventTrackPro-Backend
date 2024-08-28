let adminModel = require("../models/admin.model");
let jwt = require("jsonwebtoken");
let nodemailer = require("nodemailer");
let eventModel = require("../models/event.model");
let addCounterModel = require("../models/addCounter.model");
let userModel = require("../models/user.model");
let counterModel = require("../models/counter.Model");
let countCoordinatorModel = require("../models/countCoordinator.model");
let coordinatorNotification = require("../models/coordinatorNotification.model");
let counterNotificationModel = require("../models/counterNotification.model");
let countModel = require("../models/count.model");

const Event = require("../models/event.model");
const Users = require("../models/user.model");
const Admin = require("../models/user.model");
const Counter = require("../models/addCounter.model");
const CountCoordinator = require("../models/countCoordinator.model");
const coordinatorNotificationModel = require("../models/coordinatorNotification.model");
const rejectedCountModel = require("../models/rejectedcount.model");
const submittedCountModel = require("../models/submittedCount.model");
const rejectedTotalCountModel = require("../models/rejectedTotalCount.model");

const getCountCoordinatorPage = (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let secret = process.env.SECRET;
  jwt.verify(token, secret, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ status: false, message: "Invalid Token" });
    } else {
      countCoordinatorModel
        .findOne({ email: result.email })
        .then((user) => {
          let firstname = user.firstname;
          let admin = user.userName;
          let AdminqrCode = user.userqrcode;
          let userName = user.userName;
          // console.log(firstname, "find one user");
          res.send({
            status: true,
            message: "Welcome",
            result,
            firstname,
            admin,
            AdminqrCode,
            userName,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      // console.log(result);
    }
  });
};

const countEvent = async (req, res) => {
  const admin = req.body.scannedAdmin;
  const user = req.body.user;
  // console.log(user, "user");

  try {
    const users = await Counter.find({ userName: user });
    if (users.length > 0) {
      // console.log(users, "users");

      const events = await Event.find({ uniqueId: admin });
      if (events.length > 0) {
        // console.log(events, "events");

        // Extract admin fields from users and events
        const userAdmins = users.map((u) => u.admin);
        const eventAdmins = events.map((e) => e.admin);

        console.log(userAdmins, eventAdmins, "admins");

        // Check if every admin in events matches at least one admin in users
        const allMatch = events.every((event) =>
          userAdmins.includes(event.admin)
        );

        if (allMatch) {
          res.send({ status: true, message: "user found", events, users });
        } else {
          res.send({ status: false, message: "no match" });
        }
      } else {
        res.send({ status: false, message: "No events found" });
      }
    } else {
      res.send({ status: false, message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "error finding events" });
  }
};
const loginCountCoordinator = (req, res) => {
  let email = req.body.email;
  let userName = req.body.userName;
  let password = req.body.password;
  userModel
    .findOne({ email: email, userName: userName })
    .then((user) => {
      // console.log(user, "user");
      let firstname = user.firstname;
      let lastname = user.lastname;
      let gender = user.gender;
      let countCoordinatorDetails = {
        email,
        userName,
        password,
        firstname,
        lastname,
        gender,
      };
      // console.log(countCoordinatorDetails, "counterdetails");
      let form = new countCoordinatorModel(countCoordinatorDetails);
      form
        .save()
        .then(() => {
          // console.log("Admin Saved Succesfully");
          res.send({
            status: true,
            message: "Sign up was succesful",
          });
          // console.log(res.send.status);
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

const signInCountCoordinator = (req, res) => {
  // console.log(req.body);
  let { email, password } = req.body;
  countCoordinatorModel
    .findOne({ email: email })
    .then((user) => {
      // console.log(user);
      if (!user) {
        res.send({ status: false, message: "Does not exist" });
      } else {
        let secret = process.env.SECRET;
        user.validatePassword(password, (err, same) => {
          if (!same) {
            res.send({ status: false, message: "wrong credentials" });
          } else {
            let CounterCoordinatortoken = jwt.sign({ email }, secret, {
              expiresIn: "7h",
            });
            // console.log(CounterCoordinatortoken);
            res.send({
              status: true,
              message: "Welcome",
              CounterCoordinatortoken,
            });
            // console.log("Signin successful oo");
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const saveCounter = async (req, res) => {
  let Id = req.body.eventId;
  try {
    let deleteEvent = await Event.findOneAndDelete({ eventId: Id });
    if (deleteEvent) {
      let form = new eventModel(req.body);
      form
        .save()
        .then(() => {
          res.send({
            status: true,
            message: "Event updated successfully",
            form,
          });
          // console.log(res.send.status, form);
        })
        .catch((err) => {
          console.log("error Saving");
          console.log(err);
          res.send({
            status: false,
            message: "event update unsuccessful",
          });
        });
    } else {
      res.send({ status: false, message: "error deleting event" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "error encountered" });
  }
};

const countCoordinatorEventlist = async (req, res) => {
  let user = req.body.admin;
  try {
    const events = await Event.find({ countCoordinator: user });
    res.send({ status: true, message: "events found", events });
  } catch (error) {
    console.log(error, "find error");
    res.send({ status: false, message: "error finding events" });
  }
};

const showEvent = async (req, res) => {
  const eventId = req.params.Id;
  //   console.log(req);
  try {
    const event = await Event.findOne({ eventId: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error finding event:", error);
    res.status(500).json({ error: "Error finding event" });
  }
};

const getCounts = async (req, res) => {
  // console.log(req.body);
  let admin = req.body.admin;
  let uniqueId = req.body.uniqueId;
  countModel
    .find({ admin: admin, uniqueId: uniqueId })
    .then((count) => {
      if (!count) {
        // console.log("count not found");
        res.send({ status: false, message: "Count not found" });
      } else {
        res.send({ status: true, message: "count found", count });
        // console.log(count, "count found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getNotification = (req, res) => {
  let Coordinator = req.body.Coordinator;
  // console.log(Coordinator, "coord");
  coordinatorNotificationModel
    .find({ Coordinator: Coordinator })
    .then((notification) => {
      if (!notification) {
        // console.log("count not found");
        res.send({ status: false, message: "Count not found" });
      } else {
        res.send({ status: true, message: "count found", notification });
        // console.log(notification, "notification found");
      }
    })
    .catch((err) => {
      // console.log(err);
    });
};

const sendNotification = (req, res) => {
  // console.log(req.body);
  let counter = req.body.counter;
  let admin = req.body.admin;
  let message = "counter sent";
  let notification = { counter, admin, message };
  // console.log(notification, "noti", counter, "coordinator", admin, "admin");
  let form = new counterNotificationModel(notification);
  // console.log(form, "form");
  form
    .save()
    .then(() => {
      // console.log("Notification sent");
      res.send({
        status: true,
        message: "Notification sent successfully",
      });
      // console.log(res.send.status);
    })
    .catch((err) => {
      // console.log("error Saving");
      // console.log(err);
      res.send({ status: false, message: "Sign up was not succesful" });
    });
};

const rejectCount = async (req, res) => {
  let rejectedId = req.body.rejectedId;
  let rejectedSender = req.body.rejectedSender;
  let rejectedCount = req.body.rejected;
  console.log(req.body);
  try {
    let form = new rejectedCountModel(req.body.rejected);
    form.save().then(async () => {
      let deletedCount = await countModel.findOneAndDelete({
        uniqueId: rejectedId,
        sender: rejectedSender,
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

const submitCount = async (req, res) => {
  let details = req.body.submittedCount;
  try {
    form = await new submittedCountModel(details);
    form.save().then((response) => {
      if (response) {
        res.send({ status: true, message: "total count submitted" });
      } else {
        res.send({ status: false, message: "total count not submitted" });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getRejectedCount = (req, res) => {
  let counter = req.body.counter;
  console.log(counter, "counter");
  rejectedTotalCountModel
    .findOne({ coordinator: counter })
    .then((rejected) => {
      if (!rejected) {
        res.send({ status: false, message: "Count accepted" });
      } else {
        res.send({ status: true, message: "Count rejected", rejected });
        console.log(rejected, "rejj");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const assignCounters = async (req, res) => {
  let event = req.body.event;
  let newAssignedServiceIndex = req.body.values;
  let eventName = event.eventName;
  let setDate = event.setDate;
  let serviceIndex = event.serviceIndex;
  let serviceRows = event.serviceRows;
  let eventId = event.eventId;
  let uniqueId = event.uniqueId;
  let admin = event.admin;
  let counter = event.counter;
  let countCoordinator = event.countCoordinator;
  let assignedServiceIndex = newAssignedServiceIndex.assignedServiceIndex;
  let eventObj = {
    eventName,
    setDate,
    serviceIndex,
    serviceRows,
    eventId,
    uniqueId,
    admin,
    counter,
    countCoordinator,
    assignedServiceIndex,
  };
  console.log(eventObj, "wow hoppee", newAssignedServiceIndex);
  try {
    let deleteEvent = await Event.findOneAndDelete(event);
    if (deleteEvent) {
      let form = new eventModel(eventObj);
      form
        .save()
        .then(() => {
          res.send({
            status: true,
            message: "Event updated successfully",
            form,
          });
          // console.log(res.send.status, form);
        })
        .catch((err) => {
          console.log("error Saving");
          console.log(err);
          res.send({
            status: false,
            message: "event update unsuccessful",
          });
        });
    } else {
      res.send({ status: false, message: "error deleting event" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "error encountered" });
  }
};

module.exports = {
  countEvent,
  getCountCoordinatorPage,
  saveCounter,
  loginCountCoordinator,
  signInCountCoordinator,
  countCoordinatorEventlist,
  showEvent,
  getCounts,
  getNotification,
  sendNotification,
  rejectCount,
  submitCount,
  getRejectedCount,
  assignCounters,
};
