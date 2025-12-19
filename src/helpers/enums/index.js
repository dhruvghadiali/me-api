/**
 * Central exports for all enums
 * This file provides a single import point for all enumerations in the application
 */

// Import all enum modules
const userEnums = require("@ME/helpers/enums/userEnums");
const apiEnums = require("@ME/helpers/enums/apiEnums");
const otpEnums = require("@ME/helpers/enums/otpEnums");
const admissionEnums = require("@ME/helpers/enums/admissionEnums");
const studentEnums = require("@ME/helpers/enums/studentEnums");

const enums = {
  ...userEnums,
  ...apiEnums,
  ...otpEnums,
  ...admissionEnums,
  ...studentEnums,
};

module.exports = enums;
