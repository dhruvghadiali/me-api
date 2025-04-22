const Zipcode = require("@MEModels/zipcodeModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  zipcodePutRequestFail,
  zipcodePostRequestFail,
  zipcodeDeleteRequestFail,
  zipcodePutRequestSuccess,
  zipcodePostRequestSuccess,
  zipcodesGetRequestSuccess,
  zipcodeDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get zipcodes
 * @route   POST /super-admin/zipcodes
 * @access  Super Admin
 */
const getZipcodes = asyncHandler(async (req, res, next) => {
  // Find zipcodes that are is_active status value is true and sort them by zipcode
  const zipcodes = await Zipcode.find({
    is_active: true,
  })
    .select(["zipcode", "created_at", "updated_at", "created_by", "updated_by"])
    .populate([
      { path: "created_by updated_by" },
      {
        path: "area_name",
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
        ],
      },
    ])
    .sort({ zipcode: 1 });

  // Send response
  res.status(200).json({
    data: zipcodes,
    message: zipcodesGetRequestSuccess,
  });
});

/**
 * @desc    Add zipcode
 * @route   POST /super-admin/zipcodes
 * @access  Super Admin
 */
const addZipcode = asyncHandler(async (req, res, next) => {
  let response;
  const { area_name, zipcode } = req.body;
  const { id } = req.user;

  // Find zipcode that has is_active status value is false
  const zipcodeInfo = await Zipcode.findOne({
    zipcode: zipcode ? zipcode : "",
    area_name: area_name ? area_name : "",
    is_active: false,
  });

  if (zipcodeInfo) {
    // If zipcode is already present, update the is_active status value to true with the user who signin
    response = await Zipcode.findByIdAndUpdate(
      zipcodeInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If zipcode is not present, create a new zipcode with the user who signin
    response = await Zipcode.create({
      zipcode,
      area_name,
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
      message: zipcodePostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(zipcodePostRequestFail, 400));
  }
});

/**
 * @desc    Update zipcode
 * @route   POST /super-admin/zipcodes
 * @access  Super Admin
 */
const updateZipcode = asyncHandler(async (req, res, next) => {
  const { zipcode, area_name } = req.body;
  const { id } = req.user;

  // Find zipcode id and update zipcode info with user who signin
  const response = await Zipcode.findByIdAndUpdate(
    req.params.id,
    { zipcode, area_name, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .select([
      "zipcode",
      "area_name",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ])
    .populate("created_by updated_by");

  if (response) {
    // Send response
    res.status(200).json({
      data: [response],
      message: zipcodePutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(zipcodePutRequestFail, 400));
  }
});

/**
 * @desc    Delete zipcode
 * @route   DELETE /super-admin/zipcodes
 * @access  Super Admin
 */
const deleteZipcode = asyncHandler(async (req, res, next) => {
  // Find zipcode id and update is_active status to false
  const zipcode = await Zipcode.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  if (zipcode) {
    // Send response
    res.status(200).json({
      data: [],
      message: zipcodeDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(zipcodeDeleteRequestFail, 400));
  }
});

module.exports = {
  addZipcode,
  getZipcodes,
  updateZipcode,
  deleteZipcode,
};
