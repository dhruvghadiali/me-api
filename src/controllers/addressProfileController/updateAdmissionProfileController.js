const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const Address = require("@MEModels/addressModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  addressDetailsRequired,
  addressDetailsIdRequired,
  addressDetailsPutRequestFail,
  addressDetailsPutRequestSuccess,
} = require("@MEHelpers/responseMessage/addressProfileResponseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Update address profile for student
 * @route   PUT /student/profile/addresses/:id
 * @access  Student
 */
const updateAddress = asyncHandler(async (req, res, next) => {
  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(addressDetailsRequired, HTTP_STATUS_CODES.STATUS_400)
    );
  }

  // Validate address ID is provided
  if (!req.params.id) {
    return next(
      new ErrorResponse(addressDetailsIdRequired, HTTP_STATUS_CODES.STATUS_400)
    );
  }

  // Build update object with only provided fields
  const updateData = {
    ...(req.body.address && { address: req.body.address }),
    ...(req.body.state && { state: req.body.state }),
    ...(req.body.district && { district: req.body.district }),
    ...(req.body.city && { city: req.body.city }),
    ...(req.body.area_name && { area_name: req.body.area_name }),
    ...(req.body.zipcode && { zipcode: req.body.zipcode }),
  };

  // Update address document
  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  // Check if address exists
  if (!updatedAddress) {
    return next(
      new ErrorResponse(
        addressDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_404
      )
    );
  }

  // Populate references for response
  const populatedAddress = await updatedAddress.populate([
    { path: "state" },
    { path: "district" },
    { path: "city" },
    { path: "area_name" },
    { path: "zipcode" },
  ]);

  if (!populatedAddress) {
    // Send failure response
    return next(
      new ErrorResponse(
        addressDetailsPutRequestFail,
        HTTP_STATUS_CODES.STATUS_500
      )
    );
  } else {
    // Send success response
    return res.status(HTTP_STATUS_CODES.STATUS_200).json({
      data: [populatedAddress],
      message: addressDetailsPutRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_200,
    });
  }
});

module.exports = { updateAddress };
