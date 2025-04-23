const AreaName = require("@MEModels/areaNameModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  areaNamePutRequestFail,
  areaNamePostRequestFail,
  areaNameDeleteRequestFail,
  areaNamePutRequestSuccess,
  areaNamePostRequestSuccess,
  areaNamesGetRequestSuccess,
  areaNameDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get area names
 * @route   POST /super-admin/area-names
 * @access  Super Admin
 */
const getAreaNames = asyncHandler(async (req, res, next) => {
  // Find area names that are is_active status value is true and sort them by area name
  const areaNames = await AreaName.find({
    is_active: true,
  })
    .select(["name", "created_at", "updated_at", "created_by", "updated_by"])
    .populate([
      { path: "created_by updated_by" },
      {
        path: "city",
        select: [
          "name",
          "created_at",
          "updated_at",
          "created_by",
          "updated_by",
        ],
        populate: [
          { path: "created_by updated_by" },
          {
            path: "district",
            select: [
              "name",
              "created_at",
              "updated_at",
              "created_by",
              "updated_by",
            ],
            populate: [
              { path: "created_by updated_by" },
              {
                path: "state",
                select: [
                  "name",
                  "created_at",
                  "updated_at",
                  "created_by",
                  "updated_by",
                ],
                populate: "created_by updated_by",
              },
            ],
          },
        ],
      },
      { path: "zipcode_count" },
      {
        path: "zipcodes",
        select: [
          "zipcode",
          "created_at",
          "updated_at",
          "created_by",
          "updated_by",
        ],
        populate: "created_by updated_by",
      },
    ])
    .sort({ name: 1 });

  // Send response
  res.status(200).json({
    data: areaNames,
    message: areaNamesGetRequestSuccess,
  });
});

/**
 * @desc    Add area name
 * @route   POST /super-admin/area-names
 * @access  Super Admin
 */
const addAreaName = asyncHandler(async (req, res, next) => {
  let response;
  const { name, city } = req.body;
  const { id } = req.user;

  // Find area name that has is_active status value is false
  const areaNameInfo = await AreaName.findOne({
    name: name ? name : "",
    city: city ? city : "",
    is_active: false,
  });

  if (areaNameInfo) {
    // If area name is already present, update the is_active status value to true with the user who signin
    response = await AreaName.findByIdAndUpdate(
      areaNameInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If area name is not present, create a new area name with the user who signin
    response = await AreaName.create({
      name,
      city,
      created_by: id,
      updated_by: id,
    });
  }

  if (response) {
    delete response._doc.is_active;
    delete response._doc.__v;

    // Populate the created_by and updated_by username
    await response.populate("created_by updated_by");

    res.status(201).json({
      data: [response],
      message: areaNamePostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(areaNamePostRequestFail, 400));
  }
});

/**
 * @desc    Update area name
 * @route   POST /super-admin/area-names
 * @access  Super Admin
 */
const updateAreaName = asyncHandler(async (req, res, next) => {
  const { name, city } = req.body;
  const { id } = req.user;

  // Find area name id and update area name info with user who signin
  const areaName = await AreaName.findByIdAndUpdate(
    req.params.id,
    { name, city, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .select([
      "name",
      "district",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by");

  if (areaName) {
    // Send response
    res.status(200).json({
      data: [areaName],
      message: areaNamePutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(areaNamePutRequestFail, 400));
  }
});

/**
 * @desc    Delete area name
 * @route   DELETE /super-admin/area-names
 * @access  Super Admin
 */
const deleteAreaName = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find area name id and update is_active status to false
  const areaName = await AreaName.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (areaName) {
    // Send response
    res.status(200).json({
      data: [],
      message: areaNameDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(areaNameDeleteRequestFail, 400));
  }
});

module.exports = {
  addAreaName,
  getAreaNames,
  updateAreaName,
  deleteAreaName,
};
