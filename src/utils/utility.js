const _ = require("lodash");
const moment = require("moment");

const responseMessage = require("@MEHelpers/responseMessage");

const setValidationMessage = (err) => {
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

const getISTDateTime = (dateTime) =>
  moment(dateTime).add(5, "hours").add(30, "minutes");

/**
 * Validates time slot format using moment.js
 * Accepts only 12-hour format: "HH:MM AM/PM - HH:MM AM/PM"
 * @param {string} timeSlot - Time slot string to validate
 * @returns {boolean} - True if valid, false otherwise
 * @example
 * validateTimeSlot("10:00 AM - 11:00 AM") // returns true
 * validateTimeSlot("14:30 - 15:45") // returns false (24-hour format)
 */
const validateTimeSlot = (timeSlot) => {
  if (!timeSlot || typeof timeSlot !== "string") return false;

  // Split the time slot into start and end times
  const parts = timeSlot.split("-").map((part) => part.trim());
  if (parts.length !== 2) return false;

  const [startTime, endTime] = parts;

  // Only accept 12-hour format with AM/PM
  const formats = [
    "h:mm A", // 12-hour format with AM/PM (e.g., 10:00 AM)
    "h:mm a", // 12-hour format with am/pm (e.g., 10:00 am)
  ];

  // Check if both start and end times are valid
  const startMoment = moment(startTime, formats, true);
  const endMoment = moment(endTime, formats, true);

  if (!startMoment.isValid() || !endMoment.isValid()) return false;

  // Ensure end time is after start time
  if (endMoment.isSameOrBefore(startMoment)) return false;

  return true;
};

module.exports = {
  getISTDateTime,
  setValidationMessage,
  validateTimeSlot,
};
