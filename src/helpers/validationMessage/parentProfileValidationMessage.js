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
  parentProfileAnnualIncomeRequired: `Annual income is required`,
  parentProfileAnnualIncomeInvalid: `Annual income must be more than ${parentProfileAnnualIncomeMinValue} rupees and less than ${parentProfileAnnualIncomeMaxValue} rupees`,
  parentProfileOccupationInvalid: `Occupation must be one of: ${Object.values(PARENT_OCCUPATIONS_IN).join(", ")}`,
  parentProfileEducationInvalid: `Education level must be one of: ${Object.values(EDUCATION_LEVELS_IN).join(", ")}`,
  parentProfileDateOfDeathInvalid: `Date of death is required when parent is deceased and must be a past date (not today or future)`,
  parentProfileCaringChildByMinLength: `Caring child by must be at least ${parentProfileCaringChildByMinChar} characters`,
  parentProfileCaringChildByMaxLength: `Caring child by cannot exceed ${parentProfileCaringChildByMaxChar} characters`,
  parentProfileCaringChildByRequired: `Caring child by is required and must be a non-empty string when parent is deceased`,
};

module.exports = parentProfileValidationMessage;
