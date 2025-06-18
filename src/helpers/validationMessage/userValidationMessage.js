const {
  usernameMaxChar,
  usernameMinChar,
  passwordMinChar,
  passwordMaxCharWithEncryption,
  passwordMaxCharWithoutEncryption,
} = require("@MEHelpers/validationConst");

const userValidationMessage = {
  userDetailsRequired: "User details are required",
  userDetailsEmpty: "User details cannot be empty",
  userDetailsMustBeObject: "User details must be an object formate",
  userDetailsUnknownProperty: "User details have unknown property",
  userIdRequired: "User id is required",
  usernameRequired: "Username is required",
  usernameEmpty: "Username cannot be empty",
  usernameBase: "Username must be string formate",
  usernameInvalidFormate: "Username must be string formate",
  usernameInvalid: "Invalid username. No matching username found",
  usernameMaxLength: `Username must be less then ${usernameMaxChar} characters`,
  usernameMinLength: `Username must be greater then ${usernameMinChar} characters`,
  passwordRequired: "Password is required",
  passwordEmpty: "Password cannot be empty",
  passwordBase: "Password must be string formate",
  passwordInvalidFormate: "Password must be string formate",
  passwordMinLength: `Password must be greater then ${passwordMinChar} characters`,
  passwordMaxLengthWithEncryption: `Password must be less then ${passwordMaxCharWithEncryption} characters`,
  passwordMaxLengthWithoutEncryption: `Password must be less then ${passwordMaxCharWithoutEncryption} characters`,
  signInReqBodyRequired: `Sign in request body is required`,
  signInReqBodyEmpty: `Sign in request body can't be  empty`,
  signInReqBodyBase: `Sign in request body has invalid formate`,
  signInReqBodyUnknown: `Sign in request body has unknown parameters`,
};

module.exports = userValidationMessage;
