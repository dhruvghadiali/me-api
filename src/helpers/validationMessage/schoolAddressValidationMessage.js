const { schoolAddressArrayMaxLength } = require("@MEHelpers/validationConst");

const schoolAddressValidationMessage = {
  schoolAddressDetailsRequired: `School address details are required`,
  schoolAddressDetailsEmpty: `School address details cannot be empty`,
  schoolAddressDetailsUnknownProperty: `School address details have unknown property`,
  schoolAddressDetailsMustBeObject: `School address details must be an object formate`,
  schoolAddressesDetailsRequired: `School address's details are required`,
  schoolAddressesDetailsEmpty: `School address's details can not be empty`,
  schoolAddressesDetailsMinLength: `Provide at least one school address details`,
  schoolAddressesDetailsMustBeArray: `School address's details must be array formate`,
  schoolAddressesDetailsMaxLength: `Can't add more then ${schoolAddressArrayMaxLength} school address details`,
};

module.exports = schoolAddressValidationMessage;
