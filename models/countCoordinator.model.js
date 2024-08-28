const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let countCoordinatorSchema = mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
});

let saltRound = 10;

countCoordinatorSchema.pre("save", function (next) {
  console.log(this.password);
  bcrypt.hash(this.password, saltRound, (err, hashedPassword) => {
    console.log(hashedPassword);
    if (err) {
      console.log(err);
    } else {
      this.password = hashedPassword;
      next();
    }
  });
});

countCoordinatorSchema.methods.validatePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, same) => {
    if (!err) {
      callback(err, same);
    } else {
      next();
    }
  });
};

let counterModel = mongoose.model("countCoordinator", countCoordinatorSchema);

module.exports = counterModel;
