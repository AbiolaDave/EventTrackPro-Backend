// List of imports
const express = require("express");
const router = express.Router();
const {
    countEvent,
    getCounterPage,
    saveCounter,
    loginCounter,
    signInCounter,
    counterEventlist,
    registerCounter,
    showEvent,
    sendCount,
    getNotification,
    getRejectedCount
} = require("../controllers/counter.controller");


// Routes
router.post("/countevent", countEvent);
router.get("/counterpage", getCounterPage);
router.post("/update", saveCounter)
router.post("/counterregister", registerCounter)
router.post("/counterlogin", signInCounter);
router.post("/counterpage/events", counterEventlist);
router.get("/counterpage/:Id", showEvent)
router.post("/count", sendCount);
router.post("/notification", getNotification);
router.post("/rejected", getRejectedCount);


module.exports = router;