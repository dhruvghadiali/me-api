const AdmissionDocument = require("@MEModels/admissionDocument");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");

const {
  admissionDocumentPutRequestFail,
  admissionDocumentPostRequestFail,
  admissionDocumentPutRequestSuccess,
  admissionDocumentDeleteRequestFail,
  admissionDocumentPostRequestSuccess,
  admissionDocumentsGetRequestSuccess,
  admissionDocumentDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get all admission documents
 * @route   GET /super-admin/admission-documents
 * @access  Super Admin
 */
const getAdmissionDocuments = asyncHandler(async (req, res, next) => {
  // Find admission documents that are is_active status value is true and sort them by admission_document
  const admissionDocuments = await AdmissionDocument.find({
    is_active: true,
  })
    .select([
      "admission_document",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by")
    .sort({ admission_document: 1 });

  // Send response
  res.status(200).json({
    data: admissionDocuments,
    message: admissionDocumentsGetRequestSuccess,
  });
});

/**
 * @desc    Add new admission document
 * @route   POST /super-admin/admission-documents
 * @access  Super Admin
 */
const addAdmissionDocument = asyncHandler(async (req, res, next) => {
  let response;
  const { admission_document } = req.body;
  const { id } = req.user;

  // Find admission_document that has is_active status value is false
  const admissionDocumentInfo = await AdmissionDocument.findOne({
    admission_document: admission_document ? admission_document : "",
    is_active: false,
  });

  if (admissionDocumentInfo) {
    // If admission_document is already present, update the is_active status value to true with the user who signin
    response = await AdmissionDocument.findByIdAndUpdate(
      admissionDocumentInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If admission_document is not present, create a new admission_document with the user who signin
    response = await AdmissionDocument.create({
      admission_document,
      created_by: id,
      updated_by: id,
    });
  }

  // If response is present, remove the unused property from the response and populate the created_by and updated_by username
  if (response) {
    delete response._doc.is_active;
    delete response._doc.__v;

    // Populate the created_by and updated_by username
    await response.populate("created_by updated_by");

    // Send response
    res.status(201).json({
      data: [response],
      message: admissionDocumentPostRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(admissionDocumentPostRequestFail, 400));
  }
});

/**
 * @desc    Update admission document
 * @route   PUT /super-admin/admission-documents/:id
 * @access  Super Admin
 */
const updateAdmissionDocument = asyncHandler(async (req, res, next) => {
  const { admission_document } = req.body;
  const { id } = req.user;

  // Find admission_document id and update admission_document with user who signin
  const admissionDocumentInfo = await AdmissionDocument.findByIdAndUpdate(
    req.params.id,
    { admission_document, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("created_by updated_by")
    .select([
      "admission_document",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ]);

  // Send response
  if (admissionDocumentInfo) {
    res.status(200).json({
      data: [admissionDocumentInfo],
      message: admissionDocumentPutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(admissionDocumentPutRequestFail, 400));
  }
});

/**
 * @desc    Delete admission document
 * @route   DELETE /super-admin/admission-documents/:id
 * @access  Super Admin
 */
const deleteAdmissionDocument = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find admission document id and update is active status to false
  const admissionDocumentInfo = await AdmissionDocument.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send response
  if (admissionDocumentInfo) {
    res.status(200).json({
      data: [],
      message: admissionDocumentDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(admissionDocumentDeleteRequestFail, 400));
  }
});

module.exports = {
  addAdmissionDocument,
  getAdmissionDocuments,
  updateAdmissionDocument,
  deleteAdmissionDocument,
};
