const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const responseMessage = require("../utils/responseMessage");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (token) {
      const decodedId = jwt.verify(token, process.env.JWT_SECRET);

      if (decodedId && decodedId.id) {
        const user = await User.findOne({ _id: decodedId.id, is_active: true });

        if (user) {
          req.user = user;
          next();
        } else {
          next(new ErrorResponse(responseMessage.unauthorizedUser, 401));
        }
      } else {
        next(new ErrorResponse(responseMessage.unauthorizedUser, 401));
      }
    } else {
      next(new ErrorResponse(responseMessage.jwtTokenError, 400));
    }
  } else {
    next(new ErrorResponse(responseMessage.jwtTokenError, 400));
  }
});