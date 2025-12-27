const {
  siblingProfileSchoolNameMinChar,
  siblingProfileSchoolNameMaxChar,
  siblingProfileAdmissionNumberMinChar,
  siblingProfileAdmissionNumberMaxChar,
  siblingProfileDateOfBirthMinAge,
  siblingProfileDateOfBirthMaxAge,
} = require("@MEHelpers/validationConst");
const { GENDERS } = require("@ME/helpers/enums/studentEnums");

const siblingProfileValidationMessage = {
  siblingProfileGenderRequired: `Gender is required`,
  siblingProfileGenderInvalid: `Gender must be one of: ${Object.values(GENDERS).join(", ")}`,
  siblingProfileDateOfBirthRequired: `Date of birth is required`,
  siblingProfileDateOfBirthInvalid: `Date of birth must result in age between ${siblingProfileDateOfBirthMinAge} and ${siblingProfileDateOfBirthMaxAge} years`,
  siblingProfileSchoolNameMinLength: `School name must be at least ${siblingProfileSchoolNameMinChar} characters long`,
  siblingProfileSchoolNameMaxLength: `School name cannot exceed ${siblingProfileSchoolNameMaxChar} characters`,
  siblingProfileAdmissionNumberMinLength: `Admission number must be at least ${siblingProfileAdmissionNumberMinChar} characters long`,
  siblingProfileAdmissionNumberMaxLength: `Admission number cannot exceed ${siblingProfileAdmissionNumberMaxChar} characters`,
  siblingProfileAdmissionNumberInvalid: `Admission number can only contain alphanumeric characters, hyphens, underscores, and forward slashes`,
};

module.exports = siblingProfileValidationMessage;
