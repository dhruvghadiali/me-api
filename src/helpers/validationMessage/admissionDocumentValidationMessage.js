const {
  admissionDocumentMaxChar,
  admissionDocumentMinChar,
} = require("@MEHelpers/validationConst");

const admissionDocumentValidationMessage = {
  admissionDocumentRequired: "Admission document is required",
  admissionDocumentInvalid: `Invalid admission document . No matching admission document  found`,
  admissionDocumentMaxLength: `Admission document  must be less then ${admissionDocumentMaxChar} characters`,
  admissionDocumentMinLength: `Admission document  must be greater then ${admissionDocumentMinChar} characters`,
};

module.exports = admissionDocumentValidationMessage;
