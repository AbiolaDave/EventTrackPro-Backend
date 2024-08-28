const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let countSchema = mongoose.Schema({
  admin: { type: String, required: true },
  male: { type: Number, required: true },
  female: { type: Number, required: true },
  children: { type: Number, required: true },
  vehicles: { type: Number, required: true },
  motorbikes: { type: Number, required: true },
  firsttimers: { type: Number, required: true },
  sender: { type: [String], required: true, default: [] },
  uniqueId: {type: String, required: true}
});

let countModel = mongoose.model("count", countSchema);

module.exports = countModel;
