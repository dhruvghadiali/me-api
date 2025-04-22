const State = require("@MEModels/stateModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");

const {
  statePutRequestFail,
  statePostRequestFail,
  stateDeleteRequestFail,
  statePutRequestSuccess,
  statesGetRequestSuccess,
  statePostRequestSuccess,
  stateDeleteRequestSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * @desc    Get states
 * @route   POST /super-admin/states
 * @access  Super Admin
 */
const getStates = asyncHandler(async (req, res, next) => {
  // Find state that are is_active status value is true and sort them by state name
  const states = await State.find({
    is_active: true,
  })
    .select(["name", "created_at", "updated_at", "created_by", "updated_by"])
    .populate([
      {
        path: "created_by updated_by",
      },
      {
        path: "district_count",
      },
      {
        path: "districts",
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
              { path: "created_by updated_by" },
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
        ],
      },
    ])
    .sort({ name: 1 });

  // Send response
  res.status(200).json({
    data: states,
    message: statesGetRequestSuccess,
  });
});

/**
 * @desc    Add state
 * @route   POST /super-admin/states
 * @access  Super Admin
 */
const addState = asyncHandler(async (req, res, next) => {
  let response;
  const { name } = req.body;
  const { id } = req.user;

  // Find state that has is_active status value is false
  const stateInfo = await State.findOne({
    name: name ? name : "",
    is_active: false,
  });

  if (stateInfo) {
    // If state is already present, update the is_active status value to true with the user who signin
    response = await State.findByIdAndUpdate(
      stateInfo.id,
      { is_active: true, updated_by: id },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // If state is not present, create a new state with the user who signin
    response = await State.create({
      name,
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
      message: statePostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(statePostRequestFail, 400));
  }
});

/**
 * @desc    Update state
 * @route   POST /super-admin/states
 * @access  Super Admin
 */
const updateState = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.user;

  // Find state id and update state name with user who signin
  const state = await State.findByIdAndUpdate(
    req.params.id,
    { name, updated_by: id },
    {
      new: true,
      runValidators: true,
    }
  )
    .select(["name", "created_at", "updated_at", "created_by", "updated_by"])
    .populate("created_by updated_by");

  if (state) {
    // Send response
    res.status(200).json({
      data: [state],
      message: statePutRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(statePutRequestFail, 400));
  }
});

/**
 * @desc    Delete state
 * @route   DELETE /super-admin/states
 * @access  Super Admin
 */
const deleteState = asyncHandler(async (req, res, next) => {
  // Find state id and update is_active status to false
  const state = await State.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  if (state) {
    // Send response
    res.status(200).json({
      data: [],
      message: stateDeleteRequestSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(stateDeleteRequestFail, 400));
  }
});

module.exports = {
  addState,
  getStates,
  updateState,
  deleteState,
};
