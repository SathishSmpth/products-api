const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const Users = require("../models/users");
const tryAndCatch = require("../utils/tryAndCatch");
const AppError = require("../utils/appError");

exports.isAuth = tryAndCatch(async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;

    if (!token) {
      return next(
        new AppError("Your are not logged in! Please login or signup!", 401)
      );
    }

    // verification of token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
    const user = await Users.findById(decoded.id);

    if (!user) {
      return next(
        new AppError("User belonging to this token does not exists!", 401)
      );
    }
    if (user.passwordChanged(decoded.iat)) {
      return next(
        new AppError(
          "Your are changed your password recently login again!",
          401
        )
      );
    }
    req.user = user;
    next();
  } else {
    return next(new AppError("Please login or signup!", 401));
  }
});
