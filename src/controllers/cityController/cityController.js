const City = require("@MEModels/cityModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  cityPutRequestFail,
  cityPostRequestFail,
  cityDeleteRequestFail,
  cityPutRequestSuccess,
  cityPostRequestSuccess,
  citiesGetRequestSuccess,
  cityDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get cities
 * @route   POST /super-admin/cities
 * @access  Super Admin
 */
const getCities = asyncHandler(async (req, res, next) => {
  // Find cities that are is_active status value is true and sort them by city name
  const cities = await City.find({
    is_active: true,
  })
    .select(["name", "created_at", "updated_at", "created_by", "updated_by"])
    .populate([
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
    ])
    .sort({ name: 1 });

  // Send response
  res.status(200).json({
    data: cities,
    message: citiesGetRequestSuccess,
    status: 200,
  });
});

/**
 * @desc    Add city
 * @route   POST /super-admin/cities
 * @access  Super Admin
 */
const addCity = asyncHandler(async (req, res, next) => {
  let response;
  const { name, district } = req.body;
  const { id } = req.user;

  // Find city that has is_active status value is false
  const cityInfo = await City.findOne({
    name: name ? name : "",
    district: district ? district : "",
    is_active: false,
  });

  if (cityInfo) {
    // If city is already present, update the is_active status value to true with the user who signin
    response = await City.findByIdAndUpdate(
      cityInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If city is not present, create a new city with the user who signin
    response = await City.create({
      name,
      district,
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
      message: cityPostRequestSuccess,
      status: 201,
    });
  } else {
    next(new ErrorResponse(cityPostRequestFail, 400));
  }
});

/**
 * @desc    Update city
 * @route   POST /super-admin/cities
 * @access  Super Admin
 */
const updateCity = asyncHandler(async (req, res, next) => {
  const { name, district } = req.body;
  const { id } = req.user;

  // Find city id and update city info with user who signin
  const city = await City.findByIdAndUpdate(
    req.params.id,
    { name, district, updated_by: id },
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

  if (city) {
    // Send response
    res.status(200).json({
      data: [city],
      message: cityPutRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(cityPutRequestFail, 400));
  }
});

/**
 * @desc    Delete city
 * @route   DELETE /super-admin/cities
 * @access  Super Admin
 */
const deleteCity = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find city id and update is_active status to false
  const city = await City.findByIdAndUpdate(
    req.params.id,
    { is_active: false, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  );

  if (city) {
    // Send response
    res.status(200).json({
      data: [],
      message: cityDeleteRequestSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(cityDeleteRequestFail, 400));
  }
});

module.exports = {
  addCity,
  getCities,
  updateCity,
  deleteCity,
};
