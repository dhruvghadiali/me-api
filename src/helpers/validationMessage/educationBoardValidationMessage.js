const {
  educationBoardMaxChar,
  educationBoardMinChar,
} = require("@MEHelpers/validationConst");

const educationBoardValidationMessage = {
  educationBoardEmpty: "Eduction board can't be empty",
  educationBoardRequired: "Education board is required",
  educationBoardIdRequired: "Eduction board id is required",
  educationBoardBase: "Eduction board must be string formate",
  educationBoardNotFound: "Eduction board not found in database",
  educationBoardIdBase: "Eduction board id must be string formate",
  educationBoardReqBodyRequired: `Eduction board request body is required`,
  educationBoardReqBodyEmpty: `Eduction board request body can't be  empty`,
  educationBoardReqBodyBase: `Eduction board request body has invalid formate`,
  educationBoardReqBodyUnknown: `Eduction board request body has unknown parameters`,
  educationBoardInvalid: `Invalid education board. No matching education board found`,
  educationBoardIdInvalid: `Invalid education board id. No matching education board id`,
  educationBoardMaxLength: `Education board must be less then ${educationBoardMaxChar} characters`,
  educationBoardMinLength: `Education board must be greater then ${educationBoardMinChar} characters`,
};

module.exports = educationBoardValidationMessage;
