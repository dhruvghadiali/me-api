const ErrorResponse = require("@MEUtils/errorResponse");
const {
  serverError,
  duplicateField,
  jwtTokenExpire,
  invalidObjectId,
  resourceNotFound,
  resourceNotFoundWithId,
  invalidRequestBodyFormat,
} = require("@MEHelpers/responseMessage");

const errorHandler = (error, req, res, next) => {
  console.log("error.value".bgRed, error.value);
  console.log("error.name".bgGreen, error.name);
  console.log("message".bgBlue, error.message);

  switch (error.name) {
    case "CastError":
      switch (typeof error.value) {
        case "string":
          error = new ErrorResponse(
            `${resourceNotFoundWithId} ${error.value}`,
            404
          );
          break;
        case "object":
          error = new ErrorResponse(
            error.value._id
              ? `${resourceNotFoundWithId} ${error.value._id}`
              : resourceNotFound,
            404
          );
          break;
        default:
          break;
      }
      break;
    case "SyntaxError":
      error = new ErrorResponse(invalidRequestBodyFormat, 400);
      break;
    case "TokenExpiredError":
      error = new ErrorResponse(jwtTokenExpire, 401);
      break;
    case "ValidationError":
      let message = Object.values(error.errors)[0];
      if (message.name === "CastError" && message.kind === "ObjectId") {
        error = new ErrorResponse(`${invalidObjectId} ${message.path}`, 400);
      } else {
        error = new ErrorResponse(message, 400);
      }
      break;
    default:
  }

  switch (error.code) {
    case 11000:
      error = new ErrorResponse(duplicateField, 400);
      break;
    default:
  }

  return res.status(error.statusCode || 500).json({
    data: [],
    message: error.message || serverError,
    status: error.statusCode || 500,
  });
};

module.exports = errorHandler;
