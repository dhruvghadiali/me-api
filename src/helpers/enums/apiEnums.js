/**
 * HTTP Status Codes enumeration
 * Defines commonly used HTTP status codes for API responses
 */
const HTTP_STATUS_CODES = Object.freeze({
  // Success responses (2xx)
  STATUS_200: 200, // OK
  STATUS_201: 201, // Created
  STATUS_202: 202, // Accepted
  STATUS_204: 204, // No Content

  // Client error responses (4xx)
  STATUS_400: 400, // Bad Request
  STATUS_401: 401, // Unauthorized
  STATUS_403: 403, // Forbidden
  STATUS_404: 404, // Not Found
  STATUS_409: 409, // Conflict
  STATUS_422: 422, // Unprocessable Entity

  // Server error responses (5xx)
  STATUS_500: 500, // Internal Server Error
  STATUS_502: 502, // Bad Gateway
  STATUS_503: 503, // Service Unavailable
});

/**
 * API Response Types enumeration
 * Defines standard response types for API endpoints
 */
const RESPONSE_TYPES = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
});

/**
 * Content Types enumeration
 * Defines commonly used content types for API responses
 */
const CONTENT_TYPES = Object.freeze({
  JSON: "application/json",
  XML: "application/xml",
  TEXT: "text/plain",
  HTML: "text/html",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
});

module.exports = {
  HTTP_STATUS_CODES,
  RESPONSE_TYPES,
  CONTENT_TYPES,
};
