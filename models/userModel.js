const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { JsonWebTokenError } = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: 20,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["users", "guide", "lead-guide", "admin"],
    default: "users",
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide password"],
    validate: {
      validator: function (el) {
        //on .create() or .save()
        //only work on save not work in findOne and update!!
        return el === this.password;
      },
      message: "password not same",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select:false
  },
});

userSchema.pre("save", async function (next) {
  //only run this only if password is modified
  if (!this.isModified("password")) return next();
  //hash password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

//y query middleware humesa tbhi chlega jb bhi string find s shuru hogie i.e. findByIAd,findOne,findByIdandUpdate

userSchema.pre("/^find/", async function (next) {
  this.find({ actove: { $ne: false } });
  next();
});

//instance method this method is avaiable in every document of a schema

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTtimestamp < changedTimestamp; //300 < 200
  }
  return false;
  //false means password not changed
};

// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

//   console.log(resetToken, this.passwordResetToken);

//   return resetToken;
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
