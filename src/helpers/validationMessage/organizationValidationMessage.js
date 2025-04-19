const {
  organizationNameMaxChar,
  organizationNameMinChar,
  organizationShortNameMaxChar,
  organizationShortNameMinChar,
  governmentRegistrationNumberMaxChar,
  governmentRegistrationNumberMinChar,
} = require("@MEHelpers/validationConst/validationConst");

const organizationValidationMessage = {
  invalidOrganization: `Invalid organization details`,
  organizationDetailsEmpty: `Organization details cannot be empty`,
  organizationDetailsRequired: `Organization details are required`,
  organizationDetailsMustBeObject: `Organization details must be object formate`,
  organizationDetailsUnknownProperty: `Organization details have unknown property`,
  organizationNameRequired: `Organization name is required`,
  organizationNameEmpty: `Organization name cannot be empty`,
  organizationNameInvalidFormate: `Organization name must be string formate`,
  organizationNameInvalid: `Invalid organization. No matching organization found`,
  organizationNameMaxLength: `Organization name must be less then ${organizationNameMaxChar} characters`,
  organizationNameMinLength: `Organization name must be greater then ${organizationNameMinChar} characters`,
  organizationShortNameEmpty: `Organization short name cannot be empty`,
  organizationShortNameInvalidFormate: `Organization short name must be string formate`,
  organizationShortNameMaxLength: `Organization short name must be less then ${organizationShortNameMaxChar} characters`,
  organizationShortNameMinLength: `Organization short name must be greater then ${organizationShortNameMinChar} characters`,
  governmentRegistrationNumberRequired: `Government registration number is required`,
  governmentRegistrationNumberEmpty: `Government registration number cannot be empty`,
  governmentRegistrationNumberInvalidFormate: `Government registration number must be string formate`,
  governmentRegistrationNumberMaxLength: `Government registration number must be less then ${governmentRegistrationNumberMaxChar} characters`,
  governmentRegistrationNumberMinLength: `Government registration number must be greater then ${governmentRegistrationNumberMinChar} characters`,
};

module.exports = organizationValidationMessage;
