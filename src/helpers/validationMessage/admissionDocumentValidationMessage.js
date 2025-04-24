const {
  admissionDocumentMaxChar,
  admissionDocumentMinChar,
} = require("@MEHelpers/validationConst");

const admissionDocumentValidationMessage = {
  admissionDocumentRequired: "Admission document is required",
  admissionDocumentEmpty: "Admission document can't be empty",
  admissionDocumentIdRequired: "Admission document id is required",
  admissionDocumentBase: "Admission document must be string formate",
  admissionDocumentNotFound: "Admission document not found in database",
  admissionDocumentIdBase: "Admission document id must be string formate",
  admissionDocumentReqBodyRequired: `Admission document request body is required`,
  admissionDocumentReqBodyEmpty: `Admission document request body can't be  empty`,
  admissionDocumentReqBodyBase: `Admission document request body has invalid formate`,
  admissionDocumentReqBodyUnknown: `Admission document request body has unknown parameters`,
  admissionDocumentInvalid: `Invalid admission document. No matching admission document  found`,
  admissionDocumentIdInvalid: `Invalid admission document id. No matching admission document id`,
  admissionDocumentMaxLength: `Admission document  must be less then ${admissionDocumentMaxChar} characters`,
  admissionDocumentMinLength: `Admission document  must be greater then ${admissionDocumentMinChar} characters`,
};

module.exports = admissionDocumentValidationMessage;
