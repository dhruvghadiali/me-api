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
  admissionApplicationStatusMustBeDocumentsUnverified: `Cannot reschedule document verification appointment. Application status must be DOCUMENTS_UNVERIFIED`,
  admissionApplicationVerificationDocumentListNotFound: `No admission verification documents found for selected academic class`,
  admissionApplicationDocumentVerificationAppointmentBookingSuccess: `Document verification appointment booked successfully`,
  admissionApplicationDocumentVerificationAppointmentRescheduleSuccess: `Document verification appointment rescheduled successfully`,
  admissionApplicationDocumentVerificationAppointmentBookingFail: `Facing issue while booking document verification appointment`,
  admissionApplicationDocumentVerificationAppointmentRescheduleFail: `Facing issue while rescheduling document verification appointment`,
  admissionApplicationDocumentVerificationStatusInvalid: `Application must be in DOCUMENTS VERIFICATION PENDING or DOCUMENTS UNVERIFIED status to update verified documents`,
  admissionApplicationVerifiedDocumentListMissing: `All school admission documents must be present in the verified documents list`,
  admissionApplicationVerifiedDocumentSuccess: `Verified documents updated successfully`,
  admissionApplicationVerifiedDocumentFail: `Facing issue while updating verified documents`,
  admissionApplicationFeeAppointmentStatusMustBeApproved: `Cannot book fee payment appointment. Application status must be APPROVED`,
  admissionApplicationFeeAppointmentScheduleSuccess: `Fee payment appointment booked successfully`,
  admissionApplicationFeeAppointmentScheduleFail: `Facing issue while booking fee payment appointment`,
  admissionApplicationFeeAppointmentRescheduleSuccess: `Fee payment appointment rescheduled successfully`,
  admissionApplicationFeeAppointmentRescheduleFail: `Facing issue while rescheduling fee payment appointment`,
  admissionApplicationsInvalidUserType: `Invalid user to access this admission applications resource please login again`,
  admissionApplicationsGetRequestFail: `No admission applications found`,
  admissionApplicationsGetRequestSuccess: `Admission applications retrieved successfully`,
  admissionApplicationsInvalidUserInformation: `Invalid user information please login again`,
  admissionApplicationStatusChangeFail: (academicSession) =>
    `Student is already selected for another school in academic session ${academicSession}`,
  admissionApplicationStatusChangeNotAllowed: (
    currentStatus,
    requestedStatus
  ) => `Cannot change status from ${currentStatus} to ${requestedStatus}`,
};

module.exports = admissionApplicationResponseMessage;
