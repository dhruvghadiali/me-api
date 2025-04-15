const _ = require("lodash");

const responseMessage = require("@MEHelpers/responseMessage");

exports.emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
exports.phoneRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
exports.youtubeURLRegex =
  /^https?:\/\/(www\.)?(youtube\.com\/(channel|c|user)\/[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+)$/;
exports.facebookURLRegex =
  /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9(.?)?]+\/?$/;
exports.instagramURLRegex =
  /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9(_)?]+\/?$/;

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
