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
  emergencyContactNameEmpty: `Name cannot be empty`,
  emergencyContactNameBase: `Name must be a valid string`,
  emergencyContactNameMaxLength: `Name cannot exceed ${emergencyContactNameMaxChar} characters`,
  emergencyContactNameMinLength: `Name must be at least ${emergencyContactNameMinChar} characters long`,
  emergencyContactRelationRequired: `Relation is required`,
  emergencyContactRelationEmpty: `Relation cannot be empty`,
  emergencyContactRelationBase: `Relation must be a valid string`,
  emergencyContactRelationInvalid: `Relation must be one of: ${Object.values(EMERGENCY_CONTACT_RELATIONS).join(", ")}`,
  emergencyContactAlternatePhoneEmpty: `Alternate phone cannot be empty`,
  emergencyContactAlternatePhoneBase: `Alternate phone must be a valid string`,
  emergencyContactAlternatePhoneInvalid: `Alternate phone must contain only digits`,
  emergencyContactAddressRequired: `Emergency contact address is required`,
  emergencyContactAddressEmpty: `Emergency contact address cannot be empty`,
  emergencyContactAddressBase: `Emergency contact address must be a valid string`,
  emergencyContactAddressMaxLength: `Emergency contact address cannot exceed ${emergencyContactAddressMaxChar} characters`,
  emergencyContactAddressMinLength: `Emergency contact address must be at least ${emergencyContactAddressMinChar} characters long`,
  emergencyContactReqBodyBase: `Emergency contact request body must be an object`,
  emergencyContactReqBodyEmpty: `Emergency contact request body cannot be empty`,
  emergencyContactReqBodyUnknown: `Unknown field in emergency contact request body`,
  emergencyContactReqBodyRequired: `Emergency contact request body is required`,
  emergencyContactUserMaxLimit: `User can have maximum 2 emergency contacts`,
};

module.exports = emergencyContactProfileValidationMessage;
