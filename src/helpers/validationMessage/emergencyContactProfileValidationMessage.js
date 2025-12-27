const {
  EMERGENCY_CONTACT_RELATIONS,
} = require("@ME/helpers/enums/studentEnums");
const {
  emergencyContactNameMinChar,
  emergencyContactNameMaxChar,
  addressMinChar,
  addressMaxChar,
} = require("@MEHelpers/validationConst");

const emergencyContactProfileValidationMessage = {
  emergencyContactNameRequired: `Name is required`,
  emergencyContactNameMinLength: `Name must be at least ${emergencyContactNameMinChar} characters long`,
  emergencyContactNameMaxLength: `Name cannot exceed ${emergencyContactNameMaxChar} characters`,
  emergencyContactRelationRequired: `Relation is required`,
  emergencyContactRelationInvalid: `Relation must be one of: ${Object.values(EMERGENCY_CONTACT_RELATIONS).join(", ")}`,
  addressMinLength: `Address must be at least ${addressMinChar} characters long`,
  addressMaxLength: `Address cannot exceed ${addressMaxChar} characters`,
};

module.exports = emergencyContactProfileValidationMessage;
