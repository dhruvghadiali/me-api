const { maxFeeAmount, minFeeAmount } = require("@MEHelpers/validationConst");

const schoolFeeValidationMessage = {
  monthlyFeeRequired: "Monthly fee is required.",
  monthlyFeeMinAmount: `Monthly fee must be at greater than ${minFeeAmount} rupees.`,
  monthlyFeeMaxAmount: `Monthly fee must be at most ${maxFeeAmount} rupees.`,
  quarterlyFeeRequired: "Quarterly fee is required.",
  quarterlyFeeMinAmount: `Quarterly fee must be at greater than ${minFeeAmount} rupees.`,
  quarterlyFeeMaxAmount: `Quarterly fee must be at most ${maxFeeAmount} rupees.`,
  halfYearlyFeeRequired: "Half-yearly fee is required.",
  halfYearlyFeeMinAmount: `Half-yearly fee must be at greater than ${minFeeAmount} rupees.`,
  halfYearlyFeeMaxAmount: `Half-yearly fee must be at most ${maxFeeAmount} rupees.`,
  yearlyFeeRequired: "Yearly fee is required.",
  yearlyFeeMinAmount: `Yearly fee must be at greater than ${minFeeAmount} rupees.`,
  yearlyFeeMaxAmount: `Yearly fee must be at most ${maxFeeAmount} rupees.`,
};

module.exports = schoolFeeValidationMessage;
