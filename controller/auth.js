const Users = require("../models/users");
const tryAndCatch = require("../utils/tryAndCatch");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const signToken = require("../utils/signToken");

exports.signUp = tryAndCatch(async (req, res, next) => {
  req.body.creationAt = new Date();
  const createuser = await Users.create(req.body);
  const token = signToken(createuser._id);
  res.status(201).json({
    status: "success",
    message: "your create a account sucessful ",
    token,
  });
});

exports.login = tryAndCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await Users.findOne({ email });
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError("please enter valid email and password", 400));
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } else {
    return next(new AppError("plese provide email and password to login", 400));
  }
});

exports.forgotPassword = tryAndCatch(async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (user) {
    try {
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });
      res.status(200).json({
        status: "success",
        message: "Your password reset link sent to your registered  email!",
        passwordReseToken: resetToken,
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpiresIn = undefined;
    }
  } else {
    return next(
      new AppError(
        "Your search did not return any results. Please try again with other information.",
        401
      )
    );
  }
});

exports.resetPassword = tryAndCatch(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = tryAndCatch(async (req, res, next) => {
  const user = await Users.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
