const {
  EMERGENCY_CONTACT_RELATIONS,
} = require("@ME/helpers/enums/studentEnums");
const {
  emergencyContactNameMinChar,
  emergencyContactNameMaxChar,
  emergencyContactAddressMaxChar,
  emergencyContactAddressMinChar,
} = require("@MEHelpers/validationConst");

const emergencyContactProfileValidationMessage = {
  emergencyContactNameRequired: `Name is required`,
  emergencyContactNameMinLength: `Name must be at least ${emergencyContactNameMinChar} characters long`,
  emergencyContactNameMaxLength: `Name cannot exceed ${emergencyContactNameMaxChar} characters`,
  emergencyContactNameBase: `Name must be a valid string`,
  emergencyContactNameEmpty: `Name cannot be empty`,
  emergencyContactRelationRequired: `Relation is required`,
  emergencyContactRelationInvalid: `Relation must be one of: ${Object.values(EMERGENCY_CONTACT_RELATIONS).join(", ")}`,
  emergencyContactRelationBase: `Relation must be a valid string`,
  emergencyContactRelationEmpty: `Relation cannot be empty`,
  alternatePhoneBase: `Alternate phone must be a valid string`,
  alternatePhoneEmpty: `Alternate phone cannot be empty`,
  alternatePhoneInvalid: `Alternate phone must contain only digits`,
  emergencyContactAddressBase: `emergency contact address must be a valid string`,
  emergencyContactAddressEmpty: `emergency contact address cannot be empty`,
  emergencyContactAddressRequired: `emergency contact address is required`,
  emergencyContactAddressMinLength: `emergency contact address must be at least ${emergencyContactAddressMinChar} characters long`,
  emergencyContactAddressMaxLength: `emergency contact address cannot exceed ${emergencyContactAddressMaxChar} characters`,
  emergencyContactReqBodyBase: `emergency contact request body must be an object`,
  emergencyContactReqBodyEmpty: `emergency contact request body cannot be empty`,
  emergencyContactReqBodyUnknown: `Unknown field in emergency contact request body`,
  emergencyContactReqBodyRequired: `emergency contact request body is required`,
};

module.exports = emergencyContactProfileValidationMessage;
