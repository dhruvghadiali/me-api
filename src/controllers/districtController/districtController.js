const District = require("@MEModels/districtModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

exports.addDistrict = asyncHandler(async (req, res, next) => {
  let response;
  const { name, state } = req.body;

  const districtInfo = await District.findOne({
    name: name ? name : "",
    state: state ? state : "",
    is_active: false,
  });

  if (districtInfo) {
    response = await District.findByIdAndUpdate(
      districtInfo.id,
      { is_active: true },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    response = await District.create(req.body);
  }

  if (response) {
    delete response._doc.is_active;
    delete response._doc.created_at;
    delete response._doc.updated_at;
    delete response._doc.__v;

    res.status(201).json({
      data: [response],
      message: responseMessage.districtPostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.districtPostRequestFail, 400));
  }
});

exports.getDistricts = asyncHandler(async (req, res, next) => {
  let queryObj = {
    is_active: true,
  };

  if (req && req.params && req.params.id) {
    queryObj = {
      ...queryObj,
      state: req.params.id,
    };
  }

  const response = await District.find(queryObj)
    .select(["name", "state"])
    .populate({
      path: "city_count",
    })
    .populate({
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
    })
    .populate({
      path: "states",
      select: ["name"],
    });

  res.status(200).json({
    data: response,
    message: responseMessage.citiesGetRequestSuccess,
  });
});
