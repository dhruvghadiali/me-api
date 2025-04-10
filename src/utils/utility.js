const User = require("@MEModels/userModel");
const validationMessage = require("@MEHelpers/validationMessage");

exports.isActiveUserValidator = {
    validator: async function (value) {
      const user = await User.findById(value);
      return !!(user && user.is_active);
    },
    message: validationMessage.usernameInvalid,
  };