// const AreaName = require("@MEModels/areaNameModel");
// const ErrorResponse = require("@MEUtils/errorResponse");
// const responseMessage = require("@MEHelpers/responseMessage");

// const { asyncHandler } = require("@MEMiddleware/async");

// exports.addAreaName = asyncHandler(async (req, res, next) => {
//   let response;
//   const { name, city } = req.body;

//   const areaNameInfo = await AreaName.findOne({
//     name: name ? name : "",
//     city: city ? city : "",
//     is_active: false,
//   });

//   if (areaNameInfo) {
//     response = await AreaName.findByIdAndUpdate(
//       areaNameInfo.id,
//       { is_active: true },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//   } else {
//     response = await AreaName.create(req.body);
//   }

//   if (response) {
//     delete response._doc.is_active;
//     delete response._doc.created_at;
//     delete response._doc.updated_at;
//     delete response._doc.__v;

//     res.status(201).json({
//       data: [response],
//       message: responseMessage.areaNamePostRequestSuccess,
//     });
//   } else {
//     next(new ErrorResponse(responseMessage.areaNamePostRequestFail, 400));
//   }
// });

// exports.getAreaNames = asyncHandler(async (req, res, next) => {
//   const areaName = await AreaName.find({
//     is_active: true,
//   })
//     .select(["-created_at", "-updated_at", "-__v", "-is_active"])
//     .populate({
//       path: "city_detail",
//       select: ["-created_at", "-updated_at", "-__v", "-is_active"],
//     })
//     .populate();

//   res.status(200).json({
//     data: [areaName],
//     message: responseMessage.areaNamesGetRequestSuccess,
//   });
// });

// /**
//  * desc
//  * route        GET /super-admin/area-names
//  * access       Private (Super Admin)
//  */
// exports.getAreaNamesWithZipcodeCount = asyncHandler(async (req, res, next) => {
//   let areaNames = await AreaName.find({
//     is_active: true,
//   })
//     .select(["-created_at", "-updated_at", "-__v", "-is_active"])
//     .populate({
//       path: "zipcods_count",
//     })
//     .populate({
//       path: "city_detail",
//       select: ["-created_at", "-updated_at", "-__v", "-is_active"],
//     });

//   res.status(200).json({
//     data: areaNames,
//     message: responseMessage.areaNamesGetRequestSuccess,
//   });
// });

// /**
//  * desc
//  * route        POST /super-admin/area-names
//  * access       Private (Super Admin)
//  */

// /**
//  * desc
//  * route        PUT /super-admin/area-names/:id
//  * access       Private (Super Admin)
//  */
// exports.updateAreaName = asyncHandler(async (req, res, next) => {
//   const areaName = await AreaName.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (areaName) {
//     delete areaName._doc.is_active;
//     delete areaName._doc.created_at;
//     delete areaName._doc.updated_at;
//     delete areaName._doc.__v;

//     res.status(200).json({
//       data: [areaName],
//       message: responseMessage.areaNamePutRequestSuccess,
//     });
//   } else {
//     next(new ErrorResponse(responseMessage.areaNamePutRequestFail, 400));
//   }
// });

// /**
//  * desc
//  * route        DELETE /super-admin/area-names/:id
//  * access       Private (Super Admin)
//  */
// exports.deleteAreaName = asyncHandler(async (req, res, next) => {
//   const areaName = await AreaName.findByIdAndUpdate(
//     req.params.id,
//     { is_active: false },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (areaName) {
//     res.status(200).json({
//       data: [],
//       message: responseMessage.areaNameDeleteRequestSuccess,
//     });
//   } else {
//     next(new ErrorResponse(responseMessage.areaNameDeleteRequestFail, 400));
//   }
// });
