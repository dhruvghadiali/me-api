const jwt = require("jsonwebtoken");

const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEHelpers/responseMessage");

// Common function for user authentication and authorization
const authorizeUser = (userType) =>
  asyncHandler(async (req, res, next) => {
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
          const user = await User.findOne({
            _id: decodedId.id,
            is_active: true,
            is_account_verified: true,
            user_type: userType,
          });

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

const superAdminProtect = authorizeUser("SUPER_ADMIN");
const schoolAdminProtect = authorizeUser("SCHOOL_ADMIN");

module.exports = {
  superAdminProtect,
  schoolAdminProtect,
};
