const mongoose = require("mongoose");
const _ = require("lodash");

const City = require("@MEModels/cityModel");
const User = require("@MEModels/userModel");
const State = require("@MEModels/stateModel");
const Zipcode = require("@MEModels/zipcodeModel");
const District = require("@MEModels/districtModel");
const AreaName = require("@MEModels/areaNameModel");
const responseMessage = require("@MEHelpers/responseMessage");
const validationMessage = require("@MEHelpers/validationMessage");

exports.emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
exports.phoneRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

exports.checkValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

exports.isActiveUserValidator = {
  validator: async function (value) {
    const user = await User.findById(value);
    return !!(user && user.is_active);
  },
  message: validationMessage.usernameInvalid,
};

exports.isStateExists = async (value) => {
  const response = await State.exists({ _id: value, is_active: true });
  if (!response) {
    throw new Error(validationMessage.stateNameNotFound);
  }
  return value;
};

exports.isDistrictExists = async (value, helpers) => {
  const response = await District.exists({
    _id: value,
    is_active: true,
    state: helpers?.state?.ancestors?.[0].state,
  });
  if (!response) {
    throw new Error(validationMessage.districtNameNotFound);
  }
  return value;
};

exports.isCityExists = async (value, helpers) => {
  const response = await City.exists({
    _id: value,
    is_active: true,
    district: helpers?.state?.ancestors?.[0].district,
  });
  if (!response) {
    throw new Error(validationMessage.cityNameNotFound);
  }
  return value;
};

exports.isAreaNameExists = async (value, helpers) => {
  const response = await AreaName.exists({
    _id: value,
    is_active: true,
    city: helpers?.state?.ancestors?.[0].city,
  });
  if (!response) {
    throw new Error(validationMessage.areaNameNotFound);
  }
  return value;
};

exports.isZipcodeExists = async (value, helpers) => {
  const response = await Zipcode.exists({
    _id: value,
    is_active: true,
    area_name: helpers?.state?.ancestors?.[0].area_name,
  });
  if (!response) {
    throw new Error(validationMessage.zipcodeNotFound);
  }
  return value;
};

exports.isStateExistsValidator = {
  validator: async function (value) {
    const stateExists = await State.findById(value);
    return !!stateExists;
  },
  message: validationMessage.stateNameInvalid,
};

exports.isDistrictExistsValidator = {
  validator: async function (value) {
    const districtExists = await District.findById(value);
    return !!districtExists;
  },
  message: validationMessage.districtNameInvalid,
};

exports.isCityExistsValidator = {
  validator: async function (value) {
    const cityExists = await City.findById(value);
    return !!cityExists;
  },
  message: validationMessage.cityNameInvalid,
};

exports.isAreaNameExistsValidator = {
  validator: async function (value) {
    const areaNameExists = await AreaName.findById(value);
    return !!areaNameExists;
  },
  message: validationMessage.areaNameInvalid,
};

exports.isZipcodeExistsValidator = {
  validator: async function (value) {
    const zipcodeExists = await Zipcode.findById(value);
    return !!zipcodeExists;
  },
  message: validationMessage.invalidZipcode,
};

exports.setValidationMessage = (err) => {
  if (err && err.details && err.details.length > 0) {
    return err.details[0].message;
  } else if (err && err.message) {
    let message;
    message = _.split(err.message, "(");
    message = message && message.length > 1 ? message[0] : err.message;
    return message;
  } else {
    return responseMessage.validationErrorMessage;
  }
};
