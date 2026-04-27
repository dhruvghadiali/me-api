const mongoose = require("mongoose");

const User = require("@MEModels/userModel");
const SchoolAddress = require("@MEModels/schoolAddressModel");

const ErrorResponse = require("@MEUtils/errorResponse");
const {
  schoolIdRequired,
  schoolAdminDetailsRequired,
  schoolAddressDetailsRequired,
} = require("@MEHelpers/responseMessage");

const { asyncHandler } = require("@MEMiddleware/async");

/**
 * @desc    Add school address
 * @route   POST /super-admin/addresses
 * @access  Super Admin
 */
const addSchoolAddress = asyncHandler(async (req, res, next) => {
  const hashedPassword = await User.setSchoolAdminDefaultPassword();
  const session = await mongoose.startSession();
  session.startTransaction();

  const { id } = req.user;
  let { school_id, school_admin, school_address } = req.body;

  if (!school_id) {
    return next(new ErrorResponse(schoolIdRequired, 400));
  } else if (!school_admin) {
    return next(new ErrorResponse(schoolAdminDetailsRequired, 400));
  } else if (!school_address) {
    return next(new ErrorResponse(schoolAddressDetailsRequired, 400));
  } else {
    try {
      let userResponse = await User.create(
        {
          ...school_admin,
          username: schoolAdmin.phone_number,
          password: hashedPassword,
          user_type: "SCHOOL_ADMIN",
          is_active: true,
          is_account_verified: true,
        },
        { session },
      );

      await SchoolAddress.create(
        {
          ...school_address,
          school: school_id,
          user: userResponse.id,
          created_by: id,
          updated_by: id,
        },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        data: [],
        message: "School address details added successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      // Send error response
      throw error;
    }
  }
});

module.exports = {
  addSchoolAddress,
};
