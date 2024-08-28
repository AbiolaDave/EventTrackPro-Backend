const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let addCounterSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  userName: { type: String, required: true},
  gender: { type: String, required: true },
  admin: { type: String, required: true},
  uniqueId: { type: String, required: true, unique: true },
  email: {type: String, required: true},
  CreationDate: { type: Date, default: Date.now },
});

let addCounterModel = mongoose.model("addCounter", addCounterSchema);

module.exports = addCounterModel;
