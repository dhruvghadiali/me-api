const _ = require("lodash");
const ErrorResponse = require("@MEUtils/errorResponse");
const Address = require("@MEModels/addressModel");

const { HTTP_STATUS_CODES } = require("@MEHelpers/enums");
const {
  addressDetailsRequired,
  addressDetailsPostRequestFail,
  addressDetailsPostRequestSuccess,
} = require("@MEHelpers/responseMessage/schoolAddressResponseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Create new address profile for student
 * @route   POST /student/profile/addresses
 * @access  Student
 */
const addAddress = asyncHandler(async (req, res, next) => {
  // Validate request body is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse(addressDetailsRequired, HTTP_STATUS_CODES.STATUS_400)
    );
  }

  // Create new address document with data from req.body
  const newAddress = await Address.create({
    user: req.user._id, // Assuming user is attached to request by auth middleware
    address: req.body.address,
    state: req.body.state,
    district: req.body.district,
    city: req.body.city,
    area_name: req.body.area_name,
    zipcode: req.body.zipcode,
  });

  // Populate references for response
  const populatedAddress = await newAddress.populate([
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
        addressDetailsPostRequestFail,
        HTTP_STATUS_CODES.STATUS_500
      )
    );
  } else {
    // Send success response
    return res.status(HTTP_STATUS_CODES.STATUS_201).json({
      data: [populatedAddress],
      message: addressDetailsPostRequestSuccess,
      status: HTTP_STATUS_CODES.STATUS_201,
    });
  }
});

module.exports = { addAddress };
