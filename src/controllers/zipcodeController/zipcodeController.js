// const ZipCode = require("@MEModels/zipcodeModel");
// const ErrorResponse = require("@MEUtils/errorResponse");
// const responseMessage = require("@MEHelpers/responseMessage");

// const { asyncHandler } = require("@MEMiddleware/async");

// exports.addZipcode = asyncHandler(async (req, res, next) => {
//   let response;
//   const { zipcode, area_name } = req.body;

//   const zipcodeInfo = await ZipCode.findOne({
//     zipcode: zipcode ? zipcode : "",
//     area_name: area_name ? area_name : "",
//     is_active: false,
//   });

//   if (zipcodeInfo) {
//     response = await ZipCode.findByIdAndUpdate(
//       zipcodeInfo.id,
//       { is_active: true },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//   } else {
//     response = await ZipCode.create(req.body);
//   }

//   if (response) {
//     delete response._doc.is_active;
//     delete response._doc.created_at;
//     delete response._doc.updated_at;
//     delete response._doc.__v;

//     res.status(201).json({
//       data: [response],
//       message: responseMessage.zipcodePostRequestSuccess,
//     });
//   } else {
//     next(new ErrorResponse(responseMessage.zipcodePostRequestFail, 400));
//   }
// });
