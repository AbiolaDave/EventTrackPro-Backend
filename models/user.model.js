const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  userqrcode: { type: Buffer, required: true },
  CreationDate: { type: Date, default: Date.now },
});

let saltRound = 10;

userSchema.pre("save", function (next) {
  console.log(this.password);
  bcrypt.hash(this.password, saltRound, (err, hashedPassword) => {
    console.log(hashedPassword);
    if (err) {
      console.log(err, "gettin error");
    } else {
      this.password = hashedPassword;
      next();
    }
  });
});

userSchema.methods.validatePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, same) => {
    if (!err) {
      callback(err, same);
    } else {
      next();
    }
  });
};

let userModel = mongoose.model("users", userSchema);

module.exports = userModel;
