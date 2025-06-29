const {
  schoolAdmissionDocumentNotesMaxChar,
  schoolAdmissionDocumentNotesMinChar,
} = require("@MEHelpers/validationConst");

const schoolAdmissionDocumentValidationMessage = {
  schoolAdmissionDocumentNotFound: `School admission document not found in database`,
  schoolAdmissionDocumentIdRequired: `School admission document id is required`,
  schoolAdmissionDocumentIdEmpty: `School admission document id can't be empty`,
  schoolAdmissionDocumentIdBase: `School admission document id must be string formate`,
  schoolAdmissionDocumentIdNotFound: `School admission document id not found in database`,
  schoolAdmissionDocumentIdInvalid: `Invalid school admission document id. No matching school admission document id`,
  schoolAdmissionDocumentVerificationStatusBase: `The document verification status must be a boolean value.`,
  schoolAdmissionDocumentVerificationStatusRequired: `The document verification status is required and must be one of the following: 'required' or 'optional'`,
  schoolAdmissionDocumentNotesEmpty: "Notes can't be empty",
  schoolAdmissionDocumentNotesBase: "Notes must be string formate",
  schoolAdmissionDocumentNotesMaxLength: `Notes must be less then ${schoolAdmissionDocumentNotesMaxChar} characters`,
  schoolAdmissionDocumentNotesMinLength: `Notes must be greater then ${schoolAdmissionDocumentNotesMinChar} characters`,
  schoolAdmissionDocumentReqBodyRequired: `School admission document request body is required`,
  schoolAdmissionDocumentReqBodyEmpty: `School admission document request body can't be  empty`,
  schoolAdmissionDocumentReqBodyBase: `School admission document request body has invalid formate`,
  schoolAdmissionDocumentReqBodyUnknown: `School admission document request body has unknown parameters`,
};

module.exports = schoolAdmissionDocumentValidationMessage;
