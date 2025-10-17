const studentProfileValidationMessage = {
  hearingIssueDetailsRequired: `hearing_issue_details is required when has_hearing_issue is true`,
  visionIssueDetailsRequired: `vision_issue_details is required when has_vision_issue is true`,
  physicalIssueDetailsRequired: `physical_issue_details is required when has_physical_issue is true`,
  mentalIssueDetailsRequired: `mental_issue_details is required when has_mental_issue is true`,
  allergiesAtLeastOne: `At least one allergy is required when has_allergies is true`,
};

module.exports = studentProfileValidationMessage;
