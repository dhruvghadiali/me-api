const {
  admissionDocumentMaxChar,
  admissionDocumentMinChar,
} = require("@MEHelpers/validationConst");

const admissionDocumentValidationMessage = {
  admissionDocumentRequired: "Admission document is required",
  admissionDocumentEmpty: "Admission document can't be empty",
  admissionDocumentBase: "Admission document must be string formate",
  admissionDocumentNotFound: "Admission document not found in database",
  admissionDocumentInvalid: `Invalid admission document. No matching admission document  found`,
  admissionDocumentMaxLength: `Admission document  must be less then ${admissionDocumentMaxChar} characters`,
  admissionDocumentMinLength: `Admission document  must be greater then ${admissionDocumentMinChar} characters`,
  admissionDocumentIdRequired: "Admission document id is required",
  admissionDocumentIdEmpty: "Admission document id can't be empty",
  admissionDocumentIdBase: "Admission document id must be string formate",
  admissionDocumentIdNotFound: "Admission document id not found in database",
  admissionDocumentIdInvalid: `Invalid admission document id. No matching admission document id`,
  admissionDocumentReqBodyRequired: `Admission document request body is required`,
  admissionDocumentReqBodyEmpty: `Admission document request body can't be  empty`,
  admissionDocumentReqBodyBase: `Admission document request body has invalid formate`,
  admissionDocumentReqBodyUnknown: `Admission document request body has unknown parameters`,
};

module.exports = admissionDocumentValidationMessage;
