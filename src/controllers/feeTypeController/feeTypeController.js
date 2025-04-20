// const FeeType = require("@MEModels/feeTypeModel");
// const ErrorResponse = require("@MEUtils/errorResponse");
// const responseMessage = require("@MEHelpers/responseMessage");

// const { asyncHandler } = require("@MEMiddleware/async");

// /**
//  * @desc    Get all fee types
//  * @route   GET /super-admin/fee-types
//  * @access  Super Admin
//  */
// exports.getFeeTypes = asyncHandler(async (req, res, next) => {
//   // Find fee types that are active status and sort them by fee_type
//   const FeeTypes = await FeeType.find({
//     is_active: true,
//   })
//     .select([
//       "fee_type",
//       "created_at",
//       "updated_at",
//       "created_by",
//       "updated_by",
//     ])
//     .populate("created_by updated_by")
//     .sort({ fee_type: 1 });

//   // Send response
//   res.status(200).json({
//     data: FeeTypes,
//     message: responseMessage.feeTypesGetRequestSuccess,
//   });
// });

// /**
//  * @desc    Add new fee type
//  * @route   POST /super-admin/fee-types
//  * @access  Super Admin
//  */
// exports.addFeeType = asyncHandler(async (req, res, next) => {
//   let response;
//   const { fee_type } = req.body;
//   const { id } = req.user;

//   // Find fee type that is_active status false
//   const feeTypeInfo = await FeeType.findOne({
//     fee_type: fee_type ? fee_type : "",
//     is_active: false,
//   });

//   if (feeTypeInfo) {
//     // If fee type is already present, update the is_active status to true with the user who signin
//     response = await FeeType.findByIdAndUpdate(
//       feeTypeInfo.id,
//       { is_active: true, updated_by: id },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//   } else {
//     // If fee type is not present, create a new fee type with the user who signin
//     response = await FeeType.create({
//       fee_type,
//       created_by: id,
//       updated_by: id,
//     });
//   }

//   // If response is present, remove the unused property from the response and populate the created_by and updated_by username
//   if (response) {
//     delete response._doc.is_active;
//     delete response._doc.__v;

//     // Populate the created_by and updated_by username
//     await response.populate("created_by updated_by");

//     // Send response
//     res.status(201).json({
//       data: [response],
//       message: responseMessage.feeTypePostRequestSuccess,
//     });
//   } else {
//     // Send error response
//     next(new ErrorResponse(responseMessage.feeTypePostRequestFail, 400));
//   }
// });

// /**
//  * @desc    Update fee type
//  * @route   PUT /super-admin/fee-types/:id
//  * @access  Super Admin
//  */
// exports.updateFeeType = asyncHandler(async (req, res, next) => {
//   const { fee_type } = req.body;
//   const { id } = req.user;

//   // Find fee type id and update fee type with user who signin
//   const feeTypeInfo = await FeeType.findByIdAndUpdate(
//     req.params.id,
//     { fee_type, updated_by: id },
//     {
//       new: true,
//       runValidators: true,
//     }
//   )
//     .populate("created_by updated_by")
//     .select([
//       "fee_type",
//       "created_at",
//       "updated_at",
//       "created_by",
//       "updated_by",
//     ]);

//   // Send response
//   if (feeTypeInfo) {
//     res.status(200).json({
//       data: [feeTypeInfo],
//       message: responseMessage.feeTypePutRequestSuccess,
//     });
//   } else {
//     // Send error response
//     next(new ErrorResponse(responseMessage.feeTypePutRequestFail, 400));
//   }
// });

// /**
//  * @desc    Delete fee type
//  * @route   DELETE /super-admin/fee-types/:id
//  * @access  Super Admin
//  */
// exports.deleteFeeType = asyncHandler(async (req, res, next) => {
//   // Find fee type id and update is active status to false
//   const feeTypeInfo = await FeeType.findByIdAndUpdate(
//     req.params.id,
//     { is_active: false },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   // Send response
//   if (feeTypeInfo) {
//     res.status(200).json({
//       data: [],
//       message: responseMessage.feeTypeDeleteRequestSuccess,
//     });
//   } else {
//     // Send error response
//     next(new ErrorResponse(responseMessage.feeTypeDeleteRequestFail, 400));
//   }
// });
