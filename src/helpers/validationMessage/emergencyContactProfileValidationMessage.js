const {
  EMERGENCY_CONTACT_RELATIONS,
} = require("@ME/helpers/enums/studentEnums");
const {
  emergencyContactNameMinChar,
  emergencyContactNameMaxChar,
} = require("@MEHelpers/validationConst");

const emergencyContactProfileValidationMessage = {
  emergencyContactNameRequired: `Name is required`,
  emergencyContactNameMinLength: `Name must be at least ${emergencyContactNameMinChar} characters long`,
  emergencyContactNameMaxLength: `Name cannot exceed ${emergencyContactNameMaxChar} characters`,
  emergencyContactRelationRequired: `Relation is required`,
  emergencyContactRelationInvalid: `Relation must be one of: ${Object.values(EMERGENCY_CONTACT_RELATIONS).join(", ")}`,
};

module.exports = emergencyContactProfileValidationMessage;
