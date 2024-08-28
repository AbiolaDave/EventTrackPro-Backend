const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let counterNotificationSchema = mongoose.Schema({
  counter: { type: [String], required: true, default: [] },
  admin: { type: String, required: true },
  message: { type: String, required: true, unique: true}
});



let counterNotificationModel = mongoose.model("counterNotification", counterNotificationSchema);

module.exports = counterNotificationModel;
