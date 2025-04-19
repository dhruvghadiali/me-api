const {
  admissionDocumentTypeMaxChar,
  admissionDocumentTypeMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const admissionDocumentTypeValidationMessage = {
  admissionDocumentTypeRequired: "Admission document type is required",
  admissionDocumentTypeInvalid: `Invalid admission document type. No matching admission document type found`,
  admissionDocumentTypeMaxLength: `Admission document type must be less then ${admissionDocumentTypeMaxChar} characters`,
  admissionDocumentTypeMinLength: `Admission document type must be greater then ${admissionDocumentTypeMinChar} characters`,
};

module.exports = admissionDocumentTypeValidationMessage;
