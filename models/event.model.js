const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let eventSchema = mongoose.Schema({
  eventName: { type: String, required: true },
  setDate: { type: Date, required: true },
  serviceIndex: { type: Number, required: true },
  serviceRows: { type: [Number], required: true },
  eventId: { type: Number, unique: true, required: true },
  uniqueId: { type: String, unique: true, required: true },
  admin: { type: String, required: true },
  counter: { type: [String], default: [] },
  countCoordinator: { type: String },
  assignedServiceIndex: { type: [String], default: [] },
  male: { type: Number },
  female: { type: Number },
  children: { type: Number },
  vehicles: { type: Number },
  motorBikes: { type: Number },
  teenagers: { type: Number },
  total: { type: Number },
  message: { type: String },
});

let eventModel = mongoose.model("event", eventSchema);

module.exports = eventModel;
