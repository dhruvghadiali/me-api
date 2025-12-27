/**
 * Student-related enumerations
 */

const EMERGENCY_CONTACT_RELATIONS = Object.freeze({
  GUARDIAN: "guardian",
  BROTHER: "brother",
  SISTER: "sister",
  GRANDFATHER: "grandfather",
  GRANDMOTHER: "grandmother",
  UNCLE: "uncle",
  AUNT: "aunt",
  COUSIN: "cousin",
  FRIEND: "friend",
  NEIGHBOR: "neighbor",
  OTHER: "other",
});

// Gender enumeration for students (keep in sync with schema)
const GENDERS = Object.freeze({
  MALE: "male",
  FEMALE: "female",
});

// Blood group enumeration
const BLOOD_GROUPS = Object.freeze({
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
  O_POS: "O+",
  O_NEG: "O-",
});

/**
 * Indian region specific enums
 */

// Common occupation categories in India (normalized, lowercase)
const PARENT_OCCUPATIONS_IN = Object.freeze({
  GOVERNMENT_SERVICE: "government_service",
  PRIVATE_SERVICE: "private_service",
  SELF_EMPLOYED: "self_employed",
  BUSINESS: "business",
  FARMER: "farmer",
  LABOURER: "labourer",
  HOMEMAKER: "homemaker",
  RETIRED: "retired",
  UNEMPLOYED: "unemployed",
  STUDENT: "student",
  TEACHER: "teacher",
  DOCTOR: "doctor",
  ENGINEER: "engineer",
  DEFENCE: "defence",
  DRIVER: "driver",
  ARTISAN: "artisan",
  SHOPKEEPER: "shopkeeper",
  DAILY_WAGE_WORKER: "daily_wage_worker",
  OTHER: "other",
});

// Common education levels in India (normalized, lowercase)
const EDUCATION_LEVELS_IN = Object.freeze({
  ILLITERATE: "illiterate",
  PRIMARY: "primary", // Class 1-5
  MIDDLE: "middle", // Class 6-8
  SECONDARY: "secondary", // Class 9-10
  HIGHER_SECONDARY: "higher_secondary", // Class 11-12
  DIPLOMA: "diploma",
  UNDERGRADUATE: "undergraduate",
  POSTGRADUATE: "postgraduate",
  DOCTORATE: "doctorate",
  PROFESSIONAL: "professional", // CA/CS/ICWA etc.
  VOCATIONAL: "vocational",
  OTHER: "other",
});

module.exports = {
  EMERGENCY_CONTACT_RELATIONS,
  GENDERS,
  BLOOD_GROUPS,
  PARENT_OCCUPATIONS_IN,
  EDUCATION_LEVELS_IN,
};
