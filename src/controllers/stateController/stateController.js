const State = require("@MEModels/stateModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEUtils/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

exports.getStates = asyncHandler(async (req, res, next) => {
  const states = await State.find({
    is_active: true,
  })
    .select(["-created_at", "-updated_at", "-__v", "-is_active"])
    .populate({
      path: "district_count",
    })
    .populate({
      path: "districts",
      select: ["name"],
      populate: [
        {
          path: "city_count",
        },
        {
          path: "cities",
          select: ["name"],
          populate: [
            {
              path: "area_count",
            },
            {
              path: "areaNames",
              select: ["name"],
              populate: [
                {
                  path: "zipcode_count",
                },
                {
                  path: "zipcodes",
                  select: ["zipcode"],
                },
              ],
            },
          ],
        },
      ],
    });

  res.status(200).json({
    data: states,
    message: responseMessage.statesGetRequestSuccess,
  });
});

exports.addState = asyncHandler(async (req, res, next) => {
  let response;
  const { name } = req.body;

  const stateInfo = await State.findOne({
    name: name ? name : "",
    is_active: false,
  });

  if (stateInfo) {
    response = await State.findByIdAndUpdate(
      stateInfo.id,
      { is_active: true },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    response = await State.create(req.body);
  }

  if (response) {
    delete response._doc.is_active;
    delete response._doc.created_at;
    delete response._doc.updated_at;
    delete response._doc.__v;

    res.status(201).json({
      data: [response],
      message: responseMessage.statePostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.statePostRequestFail, 400));
  }
});

exports.updateState = asyncHandler(async (req, res, next) => {
  const state = await State.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (state) {
    delete state._doc.is_active;
    delete state._doc.created_at;
    delete state._doc.updated_at;
    delete state._doc.__v;

    res.status(200).json({
      data: [state],
      message: responseMessage.statePutRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.statePutRequestFail, 400));
  }
});

exports.deleteState = asyncHandler(async (req, res, next) => {
  const state = await State.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  if (state) {
    res.status(200).json({
      data: [],
      message: responseMessage.stateDeleteRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.stateDeleteRequestFail, 400));
  }
});
