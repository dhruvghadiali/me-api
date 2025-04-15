const _ = require("lodash");

const responseMessage = require("@MEHelpers/responseMessage");

exports.setValidationMessage = (err) => {
  if (err && err.details && err.details.length > 0) {
    return err.details[0].message;
  } else if (err && err.message) {
    let message;
    message = _.split(err.message, "(");
    message = message && message.length > 1 ? message[0] : err.message;
    return message;
  } else {
    return responseMessage.validationErrorMessage;
  }
};
