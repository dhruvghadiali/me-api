const District = require("@MEModels/districtModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  districtPutRequestFail,
  districtPostRequestFail,
  districtDeleteRequestFail,
  districtPutRequestSuccess,
  districtPostRequestSuccess,
  districtsGetRequestSuccess,
  districtDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get districts
 * @route   POST /super-admin/districts
 * @access  Super Admin
 */
const getDistricts = asyncHandler(async (req, res, next) => {
  // Find districts that are is_active status value is true and sort them by district name
  const districts = await District.find({
    is_active: true,
  })
    .select(["name", "created_at", "updated_at", "created_by", "updated_by"])
    .populate([
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
      {
        path: "city_count",
      },
      {
        path: "cities",
        select: [
          "name",
          "created_at",
          "updated_at",
          "created_by",
          "updated_by",
        ],
        populate: [
          {
            path: "created_by updated_by",
          },
          { path: "area_count" },
          {
            path: "area_names",
            select: [
              "name",
              "created_at",
              "updated_at",
              "created_by",
              "updated_by",
            ],
            populate: [
              { path: "created_by updated_by" },
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
            ],
          },
        ],
      },
    ])
    .sort({ name: 1 });

  // Send response
  res.status(200).json({
    data: districts,
    message: districtsGetRequestSuccess,
    status: 200,
  });
});

/**
 * @desc    Add district
 * @route   POST /super-admin/districts
 * @access  Super Admin
 */
const addDistrict = asyncHandler(async (req, res, next) => {
  let response;
  const { name, state } = req.body;
  const { id } = req.user;

  // Find district that has is_active status value is false
  const districtInfo = await District.findOne({
    name: name ? name : "",
    state: state ? state : "",
    is_active: false,
  });

  if (districtInfo) {
    // If district is already present, update the is_active status value to true with the user who signin
    response = await District.findByIdAndUpdate(
      districtInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If district is not present, create a new district with the user who signin
    response = await District.create({
      name,
      state,
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
      message: districtPostRequestSuccess,
      status: 201,
    });
  } else {
    next(new ErrorResponse(districtPostRequestFail, 400));
  }
});

/**
 * @desc    Update district
 * @route   POST /super-admin/districts
 * @access  Super Admin
 */
const updateDistrict = asyncHandler(async (req, res, next) => {
  const { name, state } = req.body;
  const { id } = req.user;

  // Find district id and update district info with user who signin
  const district = await District.findByIdAndUpdate(
    req.params.id,
    { name, state, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .select([
      "name",
      "state",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by");

  if (district) {
    // Send response
    res.status(200).json({
      data: [district],
      message: districtPutRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(districtPutRequestFail, 400));
  }
});

/**
 * @desc    Delete district
 * @route   DELETE /super-admin/districts
 * @access  Super Admin
 */
const deleteDistrict = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find district id and update is_active status to false
  const district = await District.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (district) {
    // Send response
    res.status(200).json({
      data: [],
      message: districtDeleteRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(districtDeleteRequestFail, 400));
  }
});

module.exports = {
  addDistrict,
  getDistricts,
  updateDistrict,
  deleteDistrict,
};
