const {
  studentProfileDateOfBirthMaxAge,
  studentProfileDateOfBirthMinAge,
  studentProfileNationalityMinChar,
  studentProfileNationalityMaxChar,
  studentProfileMedicalIssueDetailMinChar,
  studentProfileMedicalIssueDetailMaxChar,
  studentProfileMedicalAllergiesMaxItems,
} = require("@MEHelpers/validationConst");
const { GENDERS, BLOOD_GROUPS } = require("@ME/helpers/enums/studentEnums");

const studentProfileValidationMessage = {
  studentProfileDateOfBirthRequired: `Student date of birth is required`,
  studentProfileInvalidDateOfBirth: `Date of birth must result in age between ${studentProfileDateOfBirthMinAge} and ${studentProfileDateOfBirthMaxAge} years old`,
  studentProfileGenderRequired: `Gender is required`,
  studentProfileGenderInvalid: `Gender must be one of: ${Object.values(GENDERS).join(", ")}`,
  studentProfileBloodGroupRequired: `Blood group is required`,
  studentProfileBloodGroupInvalid: `Blood group must be one of: ${Object.values(BLOOD_GROUPS).join(", ")}`,
  studentProfileAadhaarNumberRequired: `Aadhaar number is required`,
  studentProfileNationalityRequired: `Nationality is required`,
  studentProfileNationalityMaxLength: `Nationality cannot exceed ${studentProfileNationalityMaxChar} characters`,
  studentProfileNationalityMinLength: `Nationality must be at least ${studentProfileNationalityMinChar} characters`,
  hearingIssueDetailsMinLength: `Hearing issue details must be at least ${studentProfileMedicalIssueDetailMinChar} characters`,
  hearingIssueDetailsMaxLength: `Hearing issue details cannot exceed ${studentProfileMedicalIssueDetailMaxChar} characters`,
  hearingIssueDetailsRequired: `hearing_issue_details is required when has_hearing_issue is true`,
  visionIssueDetailsMinLength: `Vision issue details must be at least ${studentProfileMedicalIssueDetailMinChar} characters`,
  visionIssueDetailsMaxLength: `Vision issue details cannot exceed ${studentProfileMedicalIssueDetailMaxChar} characters`,
  visionIssueDetailsRequired: `vision_issue_details is required when has_vision_issue is true`,
  physicalIssueDetailsMinLength: `Physical issue details must be at least ${studentProfileMedicalIssueDetailMinChar} characters`,
  physicalIssueDetailsMaxLength: `Physical issue details cannot exceed ${studentProfileMedicalIssueDetailMaxChar} characters`,
  physicalIssueDetailsRequired: `physical_issue_details is required when has_physical_issue is true`,
  mentalIssueDetailsMinLength: `Mental issue details must be at least ${studentProfileMedicalIssueDetailMinChar} characters`,
  mentalIssueDetailsMaxLength: `Mental issue details cannot exceed ${studentProfileMedicalIssueDetailMaxChar} characters`,
  mentalIssueDetailsRequired: `mental_issue_details is required when has_mental_issue is true`,
  allergiesAtLeastOne: `At least one allergy is required when has_allergies is true`,
  allergiesMinItems: `Must have at least one allergy`,
  allergiesMaxItems: `Cannot add more than ${studentProfileMedicalAllergiesMaxItems} allergies`,
};

module.exports = studentProfileValidationMessage;
