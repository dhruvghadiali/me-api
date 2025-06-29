const moment = require("moment");
const mongoose = require("mongoose");

const SchoolAdmissionDocument = require("@MEModels/schoolAdmissionDocumentModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolAdmissionDocumentPutRequestFail,
  schoolAdmissionDocumentPostRequestFail,
  schoolAdmissionDocumentDeleteRequestFail,
  schoolAdmissionDocumentPutRequestSuccess,
  schoolAdmissionDocumentsGetRequestSuccess,
  schoolAdmissionDocumentPostRequestSuccess,
  schoolAdmissionDocumentDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get school admission documents
 * @route   GET /school-admin/school-admission-documents
 * @access  School Admin
 */
const getSchoolAdmissionDocuments = asyncHandler(async (req, res, next) => {
  const { school_academic_class } = req.params;

  // Find school admission documents that are is_active status value is true
  const schoolAdmissionDocuments = await SchoolAdmissionDocument.find({
    is_active: true,
    school_academic_class: school_academic_class,
  }).populate([
    {
      path: "created_by updated_by",
    },
    { path: "school_academic_class", populate: { path: "academic_class" } },
    { path: "admission_document", select: "admission_document" },
  ]);

  // Send response
  res.status(200).json({
    data: schoolAdmissionDocuments,
    message: schoolAdmissionDocumentsGetRequestSuccess,
    status: 200,
  });
});

/**
 * @desc    Add new school admission document
 * @route   POST /school-admin/school-admission-documents
 * @access  School Admin
 */
const addSchoolAdmissionDocument = asyncHandler(async (req, res, next) => {
  let response;
  const { admission_document, school_academic_class, notes } = req.body;
  const { id } = req.user;

  // Find school admission document that has is_active status value is false
  const schoolAdmissionDocumentInfo = await SchoolAdmissionDocument.findOne({
    school_academic_class: school_academic_class ? school_academic_class : "",
    admission_document: admission_document ? admission_document : "",
    is_active: false,
  });

  if (
    schoolAdmissionDocumentInfo &&
    schoolAdmissionDocumentInfo.id &&
    schoolAdmissionDocumentInfo.is_active === false
  ) {
    // If school admission document is already present, update the is_active status value to true with the user who signin
    response = await SchoolAdmissionDocument.findByIdAndUpdate(
      schoolAdmissionDocumentInfo.id,
      {
        notes,
        is_active: true,
        updated_by: id,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If school admission document is not present, create a new school admission document with the user who signin
    response = await SchoolAdmissionDocument.create({
      admission_document,
      school_academic_class,
      notes,
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
      message: schoolAdmissionDocumentPostRequestSuccess,
      status: 201,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAdmissionDocumentPostRequestFail, 400));
  }
});

/**
 * @desc    Update school admission document
 * @route   PUT /school-admin/school-admission-documents/:id
 * @access  School Admin
 */
const updateSchoolAdmissionDocument = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find school admission document id and update school admission document with user who signin
  let schoolAdmissionDocumentInfo =
    await SchoolAdmissionDocument.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    ).populate("created_by updated_by");

  if (response) {
    // Send response
    res.status(200).json({
      data: [schoolAdmissionDocumentInfo],
      message: schoolAdmissionDocumentPutRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAdmissionDocumentPutRequestFail, 400));
  }
});

/**
 * @desc    Delete school admission document
 * @route   DELETE /school-admin/school-admission-documents/:id
 * @access  School Admin
 */
const deleteSchoolAdmissionDocument = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find school admission document id and update is active status to false
  const schoolAdmissionDocumentInfo =
    await SchoolAdmissionDocument.findByIdAndUpdate(
      req.params.id,
      { is_active: false, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );

  if (schoolAdmissionDocumentInfo) {
    // Send response
    res.status(200).json({
      data: [],
      message: schoolAdmissionDocumentDeleteRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAdmissionDocumentDeleteRequestFail, 400));
  }
});

module.exports = {
  addSchoolAdmissionDocument,
  getSchoolAdmissionDocuments,
  updateSchoolAdmissionDocument,
  deleteSchoolAdmissionDocument,
};
