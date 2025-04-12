const { asyncHandler } = require("@MEMiddleware/async");

const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");
const responseMessage = require("@MEHelpers/responseMessage");

exports.signIn = asyncHandler(async (req, res, next) => {
  if (req.body.username && req.body.password) {
    const user = await User.findOne({
      username: req.body.username,
      is_active: true,
      is_account_verified: true,
      user_type: "SUPER_ADMIN",
    }).select(
      "+password -first_name -last_name -email -phone_number -is_active -is_account_verified -reset_password_token -created_at -updated_at -__v"
    );

    if (user) {
      const isPasswordMatch = await user.matchPassword(req.body.password);

      if (isPasswordMatch) {
        let token = user.getSignedJwtToken();
        user._doc.token = token;
        delete user._doc.password;
        delete user._doc.user_type;

        res.status(200).json({
          data: [user],
          message: responseMessage.superAdminSignInSuccess,
          status: 200,
        });
      } else {
        next(new ErrorResponse(responseMessage.invalidCredentials, 401));
      }
    } else {
      next(new ErrorResponse(responseMessage.invalidCredentials, 401));
    }
  } else {
    next(new ErrorResponse(responseMessage.invalidFormat, 400));
  }
});

exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    user_type: "SUPER_ADMIN",
  });

  if (user) {
    next(new ErrorResponse(responseMessage.superAdminSignUpError, 400));
  } else {
    let data = {
      first_name: "me_super_admin",
      last_name: "me_super_admin",
      email: "me_super_admin@gmail.com",
      phone_number: "1234567890",
      username: "me_super_admin",
      password: "me@123456",
      user_type: "SUPER_ADMIN",
    };

    const superAdmin = await User.create(data);

    if (superAdmin) {
      const activeSuperAdmin = await User.findOneAndUpdate(
        {
          _id: superAdmin._id,
          user_type: "SUPER_ADMIN",
        },
        {
          is_active: true,
          is_account_verified: true,
        },
        { new: true, runValidators: true }
      );

      if (activeSuperAdmin) {
        res.status(201).json({
          data: [],
          message: responseMessage.superAdminSignUpSuccess,
          status: 201,
        });
      } else {
        next(
          new ErrorResponse(
            responseMessage.superAdminSignUpActivationError,
            401
          )
        );
      }
    } else {
      next(new ErrorResponse(responseMessage.superAdminSignUpDBError, 401));
    }
  }
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    {
      _id: req.body.id,
      user_type: "SUPER_ADMIN",
    },
    { password: req.body.password, is_active: true, is_account_verified: true },
    { new: true, runValidators: true }
  );

  if (user) {
    res.status(200).json({
      data: [],
      message: responseMessage.superAdminPasswordChangedSuccess,
      status: 200,
    });
  } else {
    next(
      new ErrorResponse(responseMessage.superAdminPasswordChangedError, 400)
    );
  }
});
