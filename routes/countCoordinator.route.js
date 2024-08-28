// List of imports
const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/countCoordinator.controller");
const { sendCount } = require("../controllers/counter.controller");

// Routes
router.post("/countcoordinatorevent", countEvent);
router.get("/countcoordinatorpage", getCountCoordinatorPage);
router.post("/update", saveCounter);
router.post("/countcoordinatorregister", loginCountCoordinator);
router.post("/countcoordinatorlogin", signInCountCoordinator);
router.post("/countcoordinator/events", countCoordinatorEventlist);
router.get("/countcoordinator/:Id", showEvent);
router.post("/count", getCounts);
router.post("/notification", getNotification);
router.post("/countnotification", sendNotification);
router.post("/rejectcount", rejectCount);
router.post("/submit", submitCount);
router.post("/rejected", getRejectedCount);
router.post("/assigncounter", assignCounters);

module.exports = router;
