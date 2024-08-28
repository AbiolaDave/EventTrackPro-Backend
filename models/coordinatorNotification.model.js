const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let coordinatorNotificationSchema = mongoose.Schema({
  Coordinator: { type: String, required: true, },
  admin: { type: String, required: true },
  message: { type: String, required: true, unique: true },
});

let coordinatorNotificationModel = mongoose.model(
  "coordinatorNotification",
  coordinatorNotificationSchema
);

module.exports = coordinatorNotificationModel;
