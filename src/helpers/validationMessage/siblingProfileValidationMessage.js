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
  siblingProfileStudyingInClassBase: `Academic class must be a valid string`,
  siblingProfileStudyingInClassEmpty: `Academic class cannot be empty`,
  siblingProfileStudyingInClassRequired: `Academic class is required`,
  siblingProfileStudyingInClassInvalid: `Academic class must be a valid ObjectId`,
  siblingProfileSameSchoolBase: `Same school must be a boolean`,
  siblingProfileSchoolNameBase: `School name must be a valid string`,
  siblingProfileSchoolNameEmpty: `School name cannot be empty`,
  siblingProfileSchoolNameRequired: `School name is required when same_school is false`,
  siblingProfileAdmissionNumberBase: `Admission number must be a valid string`,
  siblingProfileAdmissionNumberEmpty: `Admission number cannot be empty`,
  siblingProfileAdmissionNumberRequired: `Admission number is required when same school is selected`,
  siblingProfileGenderRequired: `Gender is required`,
  siblingProfileGenderInvalid: `Gender must be one of: ${Object.values(GENDERS).join(", ")}`,
  siblingProfileGenderBase: `Gender must be a valid string`,
  siblingProfileGenderEmpty: `Gender cannot be empty`,
  siblingProfileDateOfBirthRequired: `Date of birth is required`,
  siblingProfileDateOfBirthBase: `Date of birth must be a valid date`,
  siblingProfileDateOfBirthEmpty: `Date of birth cannot be empty`,
  siblingProfileDateOfBirthInvalid: `Date of birth must result in age between ${siblingProfileDateOfBirthMinAge} and ${siblingProfileDateOfBirthMaxAge} years`,
  siblingProfileSchoolNameMinLength: `School name must be at least ${siblingProfileSchoolNameMinChar} characters long`,
  siblingProfileSchoolNameMaxLength: `School name cannot exceed ${siblingProfileSchoolNameMaxChar} characters`,
  siblingProfileAdmissionNumberMinLength: `Admission number must be at least ${siblingProfileAdmissionNumberMinChar} characters long`,
  siblingProfileAdmissionNumberMaxLength: `Admission number cannot exceed ${siblingProfileAdmissionNumberMaxChar} characters`,
  siblingProfileReqBodyBase: `Sibling profile request body must be an object`,
  siblingProfileReqBodyEmpty: `Sibling profile request body cannot be empty`,
  siblingProfileReqBodyUnknown: `Unknown field in sibling profile request body`,
  siblingProfileReqBodyRequired: `Sibling profile request body is required`,
};

module.exports = siblingProfileValidationMessage;
