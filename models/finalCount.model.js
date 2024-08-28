const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let finalCountSchema = mongoose.Schema({
  totalMale: { type: Number, required: true },
  totalFemale: { type: Number, required: true },
  totalChildren: { type: Number, required: true },
  totalVehicles: { type: Number, required: true },
  totalBikes: { type: Number, required: true },
  totalFirstTimers: { type: Number, required: true },
  coordinator: { type: String, required: true },
  uniqueId: { type: String, required: true },
});

let finalCountModel = mongoose.model(
  "finalcount",
  finalCountSchema
);

module.exports = finalCountModel;
