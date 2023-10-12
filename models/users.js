const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your last name"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your phone number"],
    min: 1000000000, 
    max: 9999999999, 
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    validate: {
      validator: function (pwd) {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

        return regex.test(pwd);
      },
      message:
        "Password must be contain uppercase,special characters and numbers",
    },
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter your confirm password"],
    validate: {
      validator: function (conPwd) {
        return conPwd === this.password;
      },
      message: "Password and confirm password does not match ...",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpiresIn: Date,
});

UserSchema.set("timestamps", true);

UserSchema.pre("save", async function (next) {
  // Only run password if password was actually modified
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.passwordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const users = mongoose.model("users", UserSchema);

module.exports = users;
