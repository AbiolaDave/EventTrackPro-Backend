let adminModel = require("../models/admin.model");
let jwt = require("jsonwebtoken");
let nodemailer = require("nodemailer");
let eventModel = require("../models/event.model");
let addCounterModel = require("../models/addCounter.model");
let userModel = require("../models/user.model");
let counterModel = require("../models/counter.Model");
let countModel = require("../models/count.model");
let counterNotificationModel = require("../models/counterNotification.model");

const Event = require("../models/event.model");
const Users = require("../models/user.model");
const Admin = require("../models/user.model");
const Counter = require("../models/addCounter.model");
const rejectedCountModel = require("../models/rejectedcount.model");

const getCounterPage = (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let secret = process.env.SECRET;
  jwt.verify(token, secret, (err, result) => {
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
          let userName = user.userName;
          console.log(firstname, "find one user");
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
      console.log(result);
    }
  });
};

const countEvent = async (req, res) => {
  const admin = req.body.scannedAdmin;
  const user = req.body.user;
  console.log(user, "user");

  try {
    const users = await Counter.find({ userName: user });
    if (users.length > 0) {
      console.log(users, "users");

      const events = await Event.find({ uniqueId: admin });
      if (events.length > 0) {
        console.log(events, "events");

        const userAdmins = users.map((u) => u.admin);
        const eventAdmins = events.map((e) => e.admin);

        console.log(userAdmins, eventAdmins, "admins");

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
const registerCounter = (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let userName = req.body.userName;
  let password = req.body.password;
  userModel
    .findOne({ email: email, userName: userName })
    .then((user) => {
      console.log(user, "user");
      let firstname = user.firstname;
      let lastname = user.lastname;
      let gender = user.gender;
      let counterDetails = {
        email,
        userName,
        password,
        firstname,
        lastname,
        gender,
      };
      console.log(counterDetails, "counterdetails");
      let form = new counterModel(counterDetails);
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

const signInCounter = (req, res) => {
  console.log(req.body);
  let { email, password } = req.body;
  counterModel
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
            let Countertoken = jwt.sign({ email }, secret, { expiresIn: "7h" });
            console.log(Countertoken);
            res.send({ status: true, message: "Welcome", Countertoken });
          }
        });
        console.log("Signin successful");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const saveCounter = async (req, res) => {
  let newForm = req.body
  let Id = req.body.eventId;
  console.log(req.body, "reqeeeen", newForm, "newww forrrrm");
  try {
    let deleteEvent = await Event.findOneAndDelete({ eventId: Id });
    if (deleteEvent) {
      let form = new eventModel(newForm);
      form
        .save()
        .then(() => {
          console.log("event updated successfully");
          res.send({
            status: true,
            message: "Event updated successfully",
            form,
          });
          console.log(res.send.status, form, "owowow");
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

const counterEventlist = async (req, res) => {
  let user = req.body.admin;
  try {
    const events = await Event.find({ counter: user });
    // res.json(events);
    res.send({ status: true, message: "events found", events });
    console.log(events, "events here, counnter");
  } catch (error) {
    console.log(error, "find error");
    res.send({ status: false, message: "error finding events" });
  }
};

const showEvent = async (req, res) => {
  const eventId = req.params.Id;
  console.log(req);
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

const sendCount = async (req, res) => {
 
  let form = new countModel(req.body);
  form
    .save()
    .then(() => {
      // console.log("Count sent");
      res.send({
        status: true,
        message: "Count sent successfully",
      });
      console.log(res.send.status);
    })
    .catch((err) => {
      console.log("error Saving");
      console.log(err);
      res.send({ status: false, message: "Count not succesful" });
    });
};

const getNotification = (req, res) => {
  let counter = req.body.counter;
  console.log(counter, "coord");

  counterNotificationModel
    .find({ counter: counter })
    .then((notification) => {
      if (!notification) {
        console.log("count not found");
        res.send({ status: false, message: "Count not found" });
      } else {
        res.send({ status: true, message: "count found", notification });
        console.log(notification, "notification found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getRejectedCount = (req, res) => {
  let counter = req.body.counter;
  console.log(counter, "coun");
  rejectedCountModel
    .findOne({ sender: counter })
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

module.exports = {
  countEvent,
  getCounterPage,
  saveCounter,
  registerCounter,
  signInCounter,
  counterEventlist,
  showEvent,
  sendCount,
  getNotification,
  getRejectedCount,
};
