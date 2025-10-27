const admissionApplicationResponseMessage = {
  admissionApplicationGetRequestSuccess: `Admission application details found successfully`,
  admissionApplicationPostRequestSuccess: `New admission application added successfully`,
  admissionApplicationPostRequestFail: `Facing issue while adding new admission application details`,
  admissionApplicationPutRequestSuccess: `Admission application details updated successfully`,
  admissionApplicationPutRequestFail: `Facing issue while updating admission application details`,
  admissionApplicationNotFound: `Admission application not found`,
  admissionApplicationNotAuthorizedToChangeStatus: `Not authorized to update this application status`,
  admissionApplicationDeleteRequestSuccess: `Admission application details deleted successfully`,
  admissionApplicationDeleteRequestFail: `Facing issue while deleting admission application details`,
  admissionApplicationStatusMustBeUnderReview: `Cannot book document verification appointment. Application status must be UNDER REVIEW`,
  admissionApplicationVerificationDocumentListNotFound: `No admission verification documents found for selected academic class`,
  admissionApplicationStatusChangeFail: (academicSession) =>
    `Student is already selected for another school in academic session ${academicSession}`,
  admissionApplicationStatusChangeNotAllowed: (
    currentStatus,
    requestedStatus
  ) => `Cannot change status from ${currentStatus} to ${requestedStatus}`,
};

module.exports = admissionApplicationResponseMessage;
