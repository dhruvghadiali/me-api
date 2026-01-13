const _ = require("lodash");
const moment = require("moment");

const { ADMISSION_APPLICATION } = require("@MEHelpers/enums");
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

/**
 * Generates a unique string number
 * Format: ${prefix}-YYYY-XXXXXXXX-${suffix}
 * Where YYYY is current year and XXXXXXXX is a random alphanumeric string
 * @returns {string} - Unique string number
 * @example
 * generateUniqueStringNumber() // returns "ADM-2025-A1B2C3D4"
 */
const generateUniqueStringNumber = (affixes = {}) => {
  const { prefix, suffix } = affixes;
  const year = new Date().getFullYear();
  const randomString = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();

  // Combine random string and timestamp for better uniqueness
  const uniqueId = (randomString + timestamp).substring(0, 8).toUpperCase();

  if (prefix && suffix) {
    return `${prefix}-${year}-${uniqueId}-${suffix}`;
  } else if (prefix) {
    return `${prefix}-${year}-${uniqueId}`;
  } else if (suffix) {
    return `${year}-${uniqueId}-${suffix}`;
  } else {
    return `${year}-${uniqueId}`;
  }
};
/**
 * Returns the current academic session based on the current date
 * Academic session is determined by comparing current month with ACADEMIC_SESSION_START_MONTH
 * If current month is after session start month: returns current year and next year
 * Otherwise: returns previous year and current year
 * @param {}
 * @returns {string} - Academic session in format "YYYY-YYYY"
 * @example
 * currentAcademicSession() // returns "2025-2026" if current month > ACADEMIC_SESSION_START_MONTH
 * currentAcademicSession() // returns "2024-2025" if current month <= ACADEMIC_SESSION_START_MONTH
 */
const currentAcademicSession = () => {
  return moment().month() > ADMISSION_APPLICATION.ACADEMIC_SESSION_START_MONTH
    ? `${moment().format("YYYY")}-${moment().add(1, "year").format("YYYY")}`
    : `${moment().subtract(1, "year").format("YYYY")}-${moment().format(
        "YYYY"
      )}`;
};

module.exports = {
  getISTDateTime,
  validateTimeSlot,
  setValidationMessage,
  currentAcademicSession,
  generateUniqueStringNumber,
};
