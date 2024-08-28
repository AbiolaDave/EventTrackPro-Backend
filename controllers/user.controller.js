let userModel = require("../models/user.model");
let jwt = require("jsonwebtoken");
let nodemailer = require("nodemailer");
const studentModel = require("../models/user.model");
let eventModel = require("../models/event.model");

const displayWelcome = (req, res) => {
  res.send("Welcome Users");
};

const registerUser = (req, res) => {
  // console.log(req.body);
  let form = new userModel(req.body);
  form
    .save()
    .then(() => {
      console.log("Saved Succesfully");
      res.send({ staus: true, message: "Sign up was succesful" });
    })
    .catch((err) => {
      console.log("error Saving");
      console.log(err);
      res.send({ status: false, message: "Sign up was not succesful" });
    });
};

const signInUser = (req, res) => {
  console.log(req.body);
  let { email, password } = req.body;
  userModel
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
            let token = jwt.sign({ email }, secret, { expiresIn: "7h" });
            console.log(token);
            res.send({ status: true, message: "Welcome", token });
          }
        });
        console.log("Signin successful");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDashboard = () => {
  console.log("izz working");
};

const goDashboard = (req, res) => {
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
          console.log(firstname, "find one user");
          res.send({ status: true, message: "Welcome", result, firstname });
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(result);
    }
  });
};

const sendMail = () => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  var mailOptions = {
    from: "abioladave24@gmail.com",
    to: "odesomiad.19@student.funaab.edu.ng",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  displayWelcome,
  registerUser,
  signInUser,
  getDashboard,
  goDashboard,
  sendMail,
};
