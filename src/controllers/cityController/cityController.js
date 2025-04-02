const City = require("@MEModels/cityModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEUtils/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

exports.addCity = asyncHandler(async (req, res, next) => {
  let response;
  const { name, district } = req.body;

  const cityInfo = await City.findOne({
    name: name ? name : "",
    district: district ? district : "",
    is_active: false,
  });

  if (cityInfo) {
    response = await City.findByIdAndUpdate(
      cityInfo.id,
      { is_active: true },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    response = await City.create(req.body);
  }

  if (response) {
    delete response._doc.is_active;
    delete response._doc.created_at;
    delete response._doc.updated_at;
    delete response._doc.__v;

    res.status(201).json({
      data: [response],
      message: responseMessage.cityPostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.cityPostRequestFail, 400));
  }
});

exports.getCities = asyncHandler(async (req, res, next) => {
  const cities = await City.find({
    is_active: true,
  })
    .select(["-created_at", "-updated_at", "-__v", "-is_active"])
    .populate("state_detail", [
      "-created_at",
      "-updated_at",
      "-__v",
      "-is_active",
    ]);

  res.status(200).json({
    data: [cities],
    message: responseMessage.citiesGetRequestSuccess,
  });
});

exports.getCitiesWithAreaNamesCount = asyncHandler(async (req, res, next) => {
  let cities = await City.find({
    is_active: true,
  })
    .select(["-created_at", "-updated_at", "-__v", "-is_active"])
    .populate({
      path: "area_name_count",
    })
    .populate({
      path: "state_detail",
      select: ["-created_at", "-updated_at", "-__v", "-is_active"],
    });

  res.status(200).json({
    data: cities,
    message: responseMessage.citiesGetRequestSuccess,
  });
});

exports.getCitiesByState = asyncHandler(async (req, res, next) => {
  const cities = await City.find({
    is_active: true,
    state: req.params.id,
  })
    .select(["-created_at", "-updated_at", "-__v", "-is_active"])
    .populate({
      path: "area_names_count",
    })
    .populate({
      path: "state_detail",
      select: ["-created_at", "-updated_at", "-__v", "-is_active"],
    });

  res.status(200).json({
    data: [cities],
    message: responseMessage.citiesGetRequestSuccess,
  });
});

exports.updateCity = asyncHandler(async (req, res, next) => {
  const city = await City.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (city) {
    delete city._doc.is_active;
    delete city._doc.created_at;
    delete city._doc.updated_at;
    delete city._doc.__v;

    res.status(200).json({
      data: [city],
      message: responseMessage.cityPutRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.cityPutRequestFail, 400));
  }
});

exports.deleteCity = asyncHandler(async (req, res, next) => {
  const city = await City.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  if (city) {
    res.status(200).json({
      data: [],
      message: responseMessage.cityDeleteRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.cityDeleteRequestFail, 400));
  }
});
