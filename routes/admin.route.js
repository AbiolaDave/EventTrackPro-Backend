// List of imports
const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getAdminMenu,
  addCounter,
  getAdminPage,
  signInAdmin,
  registerAdmin,
  sendCounterNotification,
  sendCoordinatorNotification,
  getTotalCount,
  finalCount,
  getFinalCount,
  rejectCount,

  // getAdminEvent,
} = require("../controllers/admin.controller");
const Event = require("../models/event.model");
const Users = require("../models/user.model");
const Admin = require("../models/user.model");

// Routes
router.post("/adminregister", registerAdmin);
router.post("/adminpage", getAdminMenu);
router.get("/adminpage", getAdminPage);
router.post("/adminsignin", signInAdmin);
router.post("/notification", sendCounterNotification);
router.post("/coordnotification", sendCoordinatorNotification);
router.post("/finalcount", finalCount);
router.post("/getfinalcount", getFinalCount);
router.post("/rejectcount", rejectCount);

// router.post("/adminpage/events", getAdminEvent);
router.post("/adminpage/events", async (req, res) => {
  console.log(req.body, "req.body here");
  //  console.log(req.body, "Body here")
  let admin = req.body.admin;
  console.log(admin);
  try {
    const events = await Event.find({ admin });
    // res.json(events);
    res.send({ status: true, message: "events found", events });
    console.log(events, "events here");
  } catch (error) {
    console.log(error, "find error");
    res.send({ status: false, message: "error finding events" });
  }
});
router.post("/scantrial", async (req, res) => {
  const counter = req.body.scannedCounter;
  try {
    const users = await Users.find({ userName: counter });
    // res.json(users);
    if (users) {
      res.send({ status: true, message: "user found", users });
    } else {
      res.send({ status: false, message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "error finding users" });
  }
});

router.post("/scan", addCounter);
router.get("/adminpage/:Id", async (req, res) => {
  const eventId = req.params.Id;

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
});

router.delete("/adminpage/:Id", async (req, res) => {
  const eventId = req.params.Id;

  try {
    const event = await Event.findOneAndDelete({ eventId: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Error deleting event" });
  }
});

router.post("/totalcounts", getTotalCount);

module.exports = router;
