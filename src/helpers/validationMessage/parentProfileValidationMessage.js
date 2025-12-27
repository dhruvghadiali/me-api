const {
  PARENT_OCCUPATIONS_IN,
  EDUCATION_LEVELS_IN,
} = require("@ME/helpers/enums/studentEnums");
const {
  parentProfileAnnualIncomeMinValue,
  parentProfileAnnualIncomeMaxValue,
  parentProfileCaringChildByMinChar,
  parentProfileCaringChildByMaxChar,
} = require("@MEHelpers/validationConst");

const parentProfileValidationMessage = {
  annualIncomeInvalid: `Annual income must be more than ${parentProfileAnnualIncomeMinValue} rupees and less than ${parentProfileAnnualIncomeMaxValue} rupees`,
  addressBase: `Address must be a valid string`,
  addressEmpty: `Address cannot be empty`,
  addressRequired: `Address is required`,
  addressInvalid: `Address must be a valid ObjectId`,
  addressOverrideBase: `Address must be a valid string`,
  addressOverrideEmpty: `Address cannot be empty`,
  addressOverrideRequired: `Address is required`,
  addressOverrideInvalid: `Address must be a valid ObjectId`,
  aliveStatusBase: `Status must be a boolean`,
  parentProfileCaringChildByBase: `Caring child by must be a valid string`,
  parentProfileCaringChildByEmpty: `Caring child by cannot be empty`,
  parentProfileCaringChildByRequired: `Caring child by is required and must be a non-empty string when parent is deceased`,
  parentProfileCaringChildByMinLength: `Caring child by must be at least ${parentProfileCaringChildByMinChar} characters`,
  parentProfileCaringChildByMaxLength: `Caring child by cannot exceed ${parentProfileCaringChildByMaxChar} characters`,
  parentProfileAnnualIncomeRequired: `Annual income is required`,
  parentProfileAnnualIncomeBase: `Annual income must be a valid number`,
  parentProfileAnnualIncomeEmpty: `Annual income cannot be empty`,
  parentProfileAnnualIncomeInvalid: `Annual income must be more than ${parentProfileAnnualIncomeMinValue} rupees and less than ${parentProfileAnnualIncomeMaxValue} rupees`,
  parentProfileOccupationRequired: `parent profile occupation is required`,
  parentProfileOccupationEmpty: `parent profile occupation cannot be empty`,
  parentProfileOccupationBase: `parent profile occupation must be a valid string`,
  parentProfileOccupationInvalid: `Occupation must be one of: ${Object.values(PARENT_OCCUPATIONS_IN).join(", ")}`,
  parentProfileEducationRequired: `parent profile education is required`,
  parentProfileEducationEmpty: `parent profile education cannot be empty`,
  parentProfileEducationBase: `parent profile education must be a valid string`,
  parentProfileEducationInvalid: `Education level must be one of: ${Object.values(EDUCATION_LEVELS_IN).join(", ")}`,
  parentProfileDateOfDeathInvalid: `Date of death is required when parent is deceased and must be a past date (not today or future)`,
  parentProfileDateOfDeathBase: `Date of death must be a valid date`,
  parentProfileDateOfDeathRequired: `Date of death is required when parent is deceased`,
  parentProfileReqBodyBase: `Parent profile request body must be an object`,
  parentProfileReqBodyEmpty: `Parent profile request body cannot be empty`,
  parentProfileReqBodyUnknown: `Unknown field in parent profile request body`,
  parentProfileReqBodyRequired: `Parent profile request body is required`,
};

module.exports = parentProfileValidationMessage;
