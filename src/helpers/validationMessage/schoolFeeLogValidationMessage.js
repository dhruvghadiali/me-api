const { schoolFeesMaxLimit } = require("@MEHelpers/validationConst");

const schoolFeeLogValidationMessage = {
  schoolFeesRequired: "School fees are required.",
  schoolFeesMinLimit: "At least one fee detail is required.",
  schoolFeesMaxLimit: `Cannot provide more then ${schoolFeesMaxLimit} fees details.`,
  schoolFeeStartDateRequired: "School fee start date is required.",
  schoolFeeStartDateInvalid: "School fee start date can not be future date.",
  schoolFeeEndDateRequired: "School fee end date is required.",
  schoolFeeEndDateInvalid: "School fee end date can not be future date.",
};

module.exports = schoolFeeLogValidationMessage;
