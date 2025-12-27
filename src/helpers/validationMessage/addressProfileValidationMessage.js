const {
  addressMinChar,
  addressMaxChar,
} = require("@MEHelpers/validationConst");

const addressProfileValidationMessage = {
  addressProfileAddressBase: `Address must be a valid string`,
  addressProfileAddressEmpty: `Address cannot be empty`,
  addressProfileAddressRequired: `Address is required`,
  addressProfileAddressMinLength: `Address must be at least ${addressMinChar} characters long`,
  addressProfileAddressMaxLength: `Address cannot exceed ${addressMaxChar} characters`,
  addressProfileStateBase: `State must be a valid string`,
  addressProfileStateEmpty: `State cannot be empty`,
  addressProfileStateInvalid: `State must be a valid ObjectId`,
  addressProfileStateRequired: `State is required`,
  addressProfileDistrictBase: `District must be a valid string`,
  addressProfileDistrictEmpty: `District cannot be empty`,
  addressProfileDistrictInvalid: `District must be a valid ObjectId`,
  addressProfileDistrictRequired: `District is required`,
  addressProfileCityBase: `City must be a valid string`,
  addressProfileCityEmpty: `City cannot be empty`,
  addressProfileCityInvalid: `City must be a valid ObjectId`,
  addressProfileCityRequired: `City is required`,
  addressProfileAreaNameBase: `Area name must be a valid string`,
  addressProfileAreaNameEmpty: `Area name cannot be empty`,
  addressProfileAreaNameInvalid: `Area name must be a valid ObjectId`,
  addressProfileAreaNameRequired: `Area name is required`,
  addressProfileZipcodeBase: `Zipcode must be a valid string`,
  addressProfileZipcodeEmpty: `Zipcode cannot be empty`,
  addressProfileZipcodeInvalid: `Zipcode must be a valid ObjectId`,
  addressProfileZipcodeRequired: `Zipcode is required`,
  addressProfileReqBodyBase: `address profile request body must be an object`,
  addressProfileReqBodyEmpty: `address profile request body cannot be empty`,
  addressProfileReqBodyUnknown: `Unknown field in address profile request body`,
  addressProfileReqBodyRequired: `address profile request body is required`,
};

module.exports = addressProfileValidationMessage;
