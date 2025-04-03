const SchoolType = require("@MEModels/schoolTypeModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEUtils/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

exports.getSchoolTypes = asyncHandler(async (req, res, next) => {
  const schoolTypes = await SchoolType.find({
    is_active: true,
  })
    .select(["school_type", "created_at", "updated_at"])
    .sort({ school_type: 1 });

  res.status(200).json({
    data: schoolTypes,
    message: responseMessage.schoolTypeGetRequestSuccess,
  });
});

exports.addSchoolType = asyncHandler(async (req, res, next) => {
  let response;
  const { school_type } = req.body;

  const schoolTypeInfo = await SchoolType.findOne({
    school_type: school_type ? school_type : "",
    is_active: false,
  });

  if (schoolTypeInfo) {
    response = await SchoolType.findByIdAndUpdate(
      schoolTypeInfo.id,
      { is_active: true },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    response = await SchoolType.create({ school_type });
  }

  if (response) {
    delete response._doc.is_active;
    delete response._doc.__v;

    res.status(201).json({
      data: [response],
      message: responseMessage.schoolTypePostRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.schoolTypePostRequestFail, 400));
  }
});

exports.updateSchoolType = asyncHandler(async (req, res, next) => {
  const schoolTypeInfo = await SchoolType.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select(["school_type", "created_at", "updated_at"]);

  if (schoolTypeInfo) {
    res.status(200).json({
      data: [schoolTypeInfo],
      message: responseMessage.schoolTypePutRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.schoolTypePutRequestFail, 400));
  }
});

exports.deleteSchoolType = asyncHandler(async (req, res, next) => {
  const schoolTypeInfo = await SchoolType.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  if (schoolTypeInfo) {
    res.status(200).json({
      data: [],
      message: responseMessage.schoolTypeDeleteRequestSuccess,
    });
  } else {
    next(new ErrorResponse(responseMessage.schoolTypeDeleteRequestFail, 400));
  }
});
