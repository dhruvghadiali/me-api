const {
  educationBoardMaxChar,
  educationBoardMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const educationBoardValidationMessage = {
  educationBoardRequired: "Education board is required",
  educationBoardInvalid:
    "Invalid education board. No matching education board found",
  educationBoardNotFound: "Education board not found in database",
  educationBoardMaxLength: `Education board must be less then ${educationBoardMaxChar} characters`,
  educationBoardMinLength: `Education board must be greater then ${educationBoardMinChar} characters`,
};

module.exports = educationBoardValidationMessage;
