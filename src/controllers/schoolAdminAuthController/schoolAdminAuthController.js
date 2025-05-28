const User = require("@MEModels/userModel");
const ErrorResponse = require("@MEUtils/errorResponse");

const { asyncHandler } = require("@MEMiddleware/async");
const {
  schoolAdminProfilePutError,
  schoolAdminProfilePutSuccess,
  schoolAdminChangePasswordError,
  schoolAdminChangePasswordSuccess,
  invalidFormat,
  invalidCredentials,
  schoolAdminSignInSuccess,
} = require("@MEHelpers/responseMessage");

/**
 * addressPopulate: Mongoose population configuration for address-related fields.
 * This array is used to populate only the 'name' or 'zipcode' fields for state, district, city, area_name, and zipcode references.
 * Ensures that only the required fields are returned in populated address objects, reducing payload size and improving clarity.
 */
const addressPopulate = [
  { path: "state", select: ["name"] },
  { path: "district", select: ["name"] },
  { path: "city", select: ["name"] },
  { path: "area_name", select: ["name"] },
  { path: "zipcode", select: ["zipcode"] },
];

/**
 * populateSchoolDetails: Populates all necessary school, organization, and address details for a user document.
 * - Populates nested references for school_address, school, education_boards (only active), school_type, and organization.
 * - Uses addressPopulate to ensure only required address fields are included.
 * - Returns a flattened object with user, school, and organization information using helper functions.
 * - Handles errors gracefully and returns an empty object if population fails.
 */
const populateSchoolDetails = async (user) => {
  try {
    await user.populate([
      {
        path: "school_address",
        populate: [
          {
            path: "school",
            populate: [
              {
                path: "education_boards",
                select: ["education_board"],
                match: { is_active: true },
              },
              { path: "school_type", select: ["school_type"] },
              {
                path: "organization",
                populate: [
                  {
                    path: "organization_member",
                    populate: addressPopulate,
                  },
                  ...addressPopulate,
                ],
              },
            ],
          },
          ...addressPopulate,
        ],
      },
    ]);

    return {
      ...setUserInformation(user),
      ...setSchoolInformation(user),
      ...setOrganizationInformation(user),
    };
  } catch (error) {
    return {};
  }
};

/**
 * setUserInformation: Extracts and formats user information from the user document.
 * - Returns an object with only the required user fields for API responses.
 * - Handles missing or undefined fields by providing default values.
 */
const setUserInformation = (user) => {
  try {
    return {
      id: user._id ? user._id : "",
      first_name: user.first_name ? user.first_name : "",
      last_name: user.last_name ? user.last_name : "",
      username: user.username ? user.username : "",
      email: user.email ? user.email : "",
      phone_number: user.phone_number ? user.phone_number : "",
      is_active: user.is_active ? user.is_active : false,
      is_account_verified: user.is_account_verified
        ? user.is_account_verified
        : false,
      created_at: user.created_at ? user.created_at : "",
      updated_at: user.updated_at ? user.updated_at : "",
      token: user.token ? user.token : "",
    };
  } catch (error) {
    return {};
  }
};

/**
 * setSchoolInformation: Extracts and formats school and school address information from the user document.
 * - Returns an object with only the required school fields for API responses.
 * - Uses instance methods (e.g., getStateName) to flatten populated references to strings.
 * - Handles missing or undefined fields by providing default values.
 */
const setSchoolInformation = (user) => {
  schoolAddress = user && user.school_address ? user.school_address : {};
  school = schoolAddress && schoolAddress.school ? schoolAddress.school : {};

  try {
    return {
      school: {
        id: school._id ? school._id : "",
        school_address_id: schoolAddress._id ? schoolAddress._id : "",
        affiliate_number: school.affiliate_number
          ? school.affiliate_number
          : "",
        school_name: school.name ? school.name : "",
        school_short_name: school.short_name ? school.short_name : "",
        email: school.email ? school.email : "",
        phone_number: school.phone_number ? school.phone_number : "",
        school_type: school.school_type
          ? school.school_type?.getSchoolType()
          : "",
        education_boards: school.education_boards,
        address: schoolAddress.address ? schoolAddress.address : "",
        state: schoolAddress.state ? schoolAddress.state?.getStateName() : "",
        district: schoolAddress.district
          ? schoolAddress.district?.getDistrictName()
          : "",
        city: schoolAddress.city ? schoolAddress.city?.getCityName() : "",
        area_name: schoolAddress.area_name
          ? schoolAddress.area_name?.getAreaName()
          : "",
        zipcode: schoolAddress.zipcode
          ? schoolAddress.zipcode?.getZipcode()
          : "",
      },
    };
  } catch (error) {
    return {};
  }
};

/**
 * setOrganizationInformation: Extracts and formats organization and organization member information from the user document.
 * - Returns an object with only the required organization fields for API responses.
 * - Flattens address and member references using instance methods and addressPopulate.
 * - Handles missing or undefined fields by providing default values.
 */
const setOrganizationInformation = (user) => {
  organization =
    user &&
    user.school_address &&
    user.school_address.school &&
    user.school_address.school.organization
      ? user.school_address.school.organization
      : {};
  organizationMembers =
    organization && organization.organization_member
      ? organization.organization_member
      : [];

  try {
    return {
      organization: {
        id: organization._id ? organization._id : "",
        name: organization.name ? organization.name : "",
        short_name: organization.short_name ? organization.short_name : "",
        email: organization.email ? organization.email : "",
        phone_number: organization.phone_number
          ? organization.phone_number
          : "",
        government_registration_number:
          organization.government_registration_number
            ? organization.government_registration_number
            : "",
        address: organization.address ? organization.address : "",
        state: organization.state ? organization.state?.getStateName() : "",
        district: organization.district
          ? organization.district?.getDistrictName()
          : "",
        city: organization.city ? organization.city?.getCityName() : "",
        area_name: organization.area_name
          ? organization.area_name?.getAreaName()
          : "",
        zipcode: organization.zipcode ? organization.zipcode?.getZipcode() : "",
        members:
          organizationMembers.length > 0
            ? organizationMembers.map((member) => {
                return {
                  id: member._id ? member._id : "",
                  first_name: member.first_name ? member.first_name : "",
                  last_name: member.last_name ? member.last_name : "",
                  email: member.email ? member.email : "",
                  phone_number: member.phone_number ? member.phone_number : "",
                  position: member.position ? member.position : "",
                  aadhaar_number: member.aadhaar_number
                    ? member.aadhaar_number
                    : "",
                  address: member.address ? member.address : "",
                  state: member.state ? member.state?.getStateName() : "",
                  district: member.district
                    ? member.district?.getDistrictName()
                    : "",
                  city: member.city ? member.city?.getCityName() : "",
                  area_name: member.area_name
                    ? member.area_name?.getAreaName()
                    : "",
                  zipcode: member.zipcode ? member.zipcode?.getZipcode() : "",
                };
              })
            : [],
      },
    };
  } catch (error) {
    return {};
  }
};

/**
 * @desc    Sign in school admin
 * @route   POST /school-admin/signin
 * @access  School Admin
 */
const signIn = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    // Check username is present in DB or not with is_active and is_account_verified status value true and user_type must be school admin.
    const user = await User.findOne({
      username: username,
      is_active: true,
      is_account_verified: true,
      user_type: "SCHOOL_ADMIN",
    }).select("+password -__v");

    if (user) {
      // Check req body password with encrypted password stored in DB.
      const isPasswordMatch = await user.matchPassword(password);

      if (isPasswordMatch) {
        // Create new JWT token.
        let token = user.getSignedJwtToken();
        user.token = token;

        // Populate school details
        response = await populateSchoolDetails(user);

        // Send response
        res.status(200).json({
          data: [response],
          message: schoolAdminSignInSuccess,
          status: 200,
        });
      } else {
        // Send error response
        next(new ErrorResponse(invalidCredentials, 401));
      }
    } else {
      // Send error response
      next(new ErrorResponse(invalidCredentials, 401));
    }
  } else {
    // Send error response
    next(new ErrorResponse(invalidFormat, 400));
  }
});

/**
 * @desc    Update school admin profile
 * @route   PUT /super-admin/school-admins/profile/:id
 * @access  Super Admin
 */
const updateSchoolAdminProfile = asyncHandler(async (req, res, next) => {
  // Find user id and update user details with user who signin
  const userInfo = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (userInfo) {
    // Send response
    res.status(200).json({
      data: [userInfo],
      message: schoolAdminProfilePutSuccess,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAdminProfilePutError, 400));
  }
});

/**
 * @desc    Change password for school admin
 * @route   GET /super-admin/school-admins/change-password/:id
 * @access  Super Admin
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  // Update school admin password and change is_active and is_account_verified status value to true.
  const user = await User.findOneAndUpdate(
    {
      _id: req.params.id,
      user_type: "SCHOOL_ADMIN",
    },
    { password: password, is_active: true, is_account_verified: true },
    { new: true, runValidators: true }
  );

  if (user) {
    // Send response
    res.status(200).json({
      data: [],
      message: schoolAdminChangePasswordSuccess,
      status: 200,
    });
  } else {
    // Send error response
    next(new ErrorResponse(schoolAdminChangePasswordError, 400));
  }
});

module.exports = {
  signIn,
  changePassword,
  updateSchoolAdminProfile,
};
