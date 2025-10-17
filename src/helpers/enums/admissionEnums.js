/**
 * Admission Application Status enumeration
 * Central enum for admission application lifecycle statuses
 */
const ADMISSION_APPLICATION_STATUS = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  CANCELLED: "cancelled",
  DOCUMENTS_VERIFICATION_PENDING: "documents_verification_pending",
  DOCUMENTS_VERIFIED: "documents_verified",
  DOCUMENTS_UNVERIFIED: "documents_unverified",
  WITHDRAWN: "withdrawn",
  APPROVED: "approved",
  REJECTED: "rejected",
  FEES_PENDING: "fees_pending",
  FEES_PAID: "fees_paid",
  SELECTED: "selected",
});

/**
 * Admission Payment Methods enumeration
 */
const ADMISSION_PAYMENT_METHODS = Object.freeze({
  UPI: "upi",
  CARD: "card",
  NETBANKING: "netbanking",
  CASH: "cash",
  OTHER: "other",
});

module.exports = {
  ADMISSION_APPLICATION_STATUS,
  ADMISSION_PAYMENT_METHODS,
};
